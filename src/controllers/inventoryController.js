// src/controllers/inventoryController.js
import prisma from '../prismaClient.js';

/**
 * GET /api/inventory
 * Fetch all inventory items with pagination + search
 */
export const getAllInventory = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const skip = (pageNumber - 1) * pageSize;

    const where = search
      ? {
          OR: [
            { model: { contains: search, mode: 'insensitive' } },
            {
              serialSims: {
                some: {
                  OR: [
                    { serialNumber: { contains: search, mode: 'insensitive' } },
                    { simNumber: { contains: search, mode: 'insensitive' } },
                  ],
                },
              },
            },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      prisma.inventory.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
        include: { serialSims: true },
      }),
      prisma.inventory.count({ where }),
    ]);

    res.status(200).json({
      data: items,
      meta: {
        total,
        currentPage: pageNumber,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Error fetching inventory list:', error);
    res.status(500).json({
      message: 'Failed to fetch inventory list',
      error: error.message,
    });
  }
};

/**
 * GET /api/inventory/:id
 * Fetch a single inventory item by ID
 */
export const getInventoryById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: 'Invalid inventory ID' });

    const item = await prisma.inventory.findUnique({
      where: { id },
      include: { serialSims: true },
    });

    if (!item) return res.status(404).json({ message: 'Inventory item not found' });

    res.status(200).json(item);
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    res.status(500).json({
      message: 'Failed to fetch inventory item',
      error: error.message,
    });
  }
};

/**
 * POST /api/inventory
 * Create a new inventory with multiple serial–SIM pairs
 */
export const createInventory = async (req, res) => {
  try {
    const { model, serialSimPairs } = req.body;

    if (!model || !Array.isArray(serialSimPairs) || serialSimPairs.length === 0) {
      return res.status(400).json({
        message: 'Missing required fields: model and serialSimPairs[]',
      });
    }

    // Check for duplicates in request
    const serials = serialSimPairs.map((p) => p.serialNumber);
    const sims = serialSimPairs.map((p) => p.simNumber);

    if (new Set(serials).size !== serials.length || new Set(sims).size !== sims.length) {
      return res.status(400).json({ message: 'Duplicate serial or SIM numbers in request' });
    }

    // Check for existing conflicts in DB
    const existing = await prisma.serialSim.findMany({
      where: { OR: [{ serialNumber: { in: serials } }, { simNumber: { in: sims } }] },
    });

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Some serial or SIM numbers already exist' });
    }

    const newInventory = await prisma.$transaction(async (tx) => {
      const createdInventory = await tx.inventory.create({
        data: { model, quantity: serialSimPairs.length },
      });

      await tx.serialSim.createMany({
        data: serialSimPairs.map((p) => ({
          serialNumber: p.serialNumber,
          simNumber: p.simNumber,
          inventoryId: createdInventory.id,
        })),
      });

      return createdInventory;
    });

    res.status(201).json({
      message: 'Inventory created successfully',
      data: newInventory,
    });
  } catch (error) {
    console.error('Error creating inventory:', error);
    res.status(500).json({ message: 'Failed to create inventory', error: error.message });
  }
};

/**
 * PUT /api/inventory/:id
 * Update inventory and synchronize serial–SIM pairs
 */
export const updateInventory = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: 'Invalid inventory ID' });

    const { model, serialSimPairs } = req.body;

    const inventory = await prisma.inventory.findUnique({
      where: { id },
      include: { serialSims: true },
    });

    if (!inventory) return res.status(404).json({ message: 'Inventory item not found' });

    const updatedInventory = await prisma.$transaction(async (tx) => {
      // Update inventory model
      await tx.inventory.update({ where: { id }, data: { model } });

      if (serialSimPairs && serialSimPairs.length > 0) {
        // Validate duplicates
        const serials = serialSimPairs.map((p) => p.serialNumber);
        const sims = serialSimPairs.map((p) => p.simNumber);

        if (new Set(serials).size !== serials.length || new Set(sims).size !== sims.length) {
          throw new Error('Duplicate serial or SIM numbers in request');
        }

        // Delete removed pairs
        const toRemove = inventory.serialSims.filter((p) => !serials.includes(p.serialNumber));
        if (toRemove.length > 0) {
          await tx.serialSim.deleteMany({ where: { id: { in: toRemove.map((r) => r.id) } } });
        }

        // Check conflicts for new pairs
        const conflicts = await tx.serialSim.findMany({
          where: {
            OR: [{ serialNumber: { in: serials } }, { simNumber: { in: sims } }],
            NOT: { inventoryId: id },
          },
        });

        if (conflicts.length > 0) {
          throw new Error('Some serial or SIM numbers already exist elsewhere');
        }

        // Add new pairs
        const toAdd = serialSimPairs.filter(
          (p) => !inventory.serialSims.find((e) => e.serialNumber === p.serialNumber)
        );

        if (toAdd.length > 0) {
          await tx.serialSim.createMany({
            data: toAdd.map((p) => ({
              serialNumber: p.serialNumber,
              simNumber: p.simNumber,
              inventoryId: id,
            })),
          });
        }

        // Update quantity
        const finalCount = await tx.serialSim.count({ where: { inventoryId: id } });
        await tx.inventory.update({ where: { id }, data: { quantity: finalCount } });
      }

      return await tx.inventory.findUnique({ where: { id }, include: { serialSims: true } });
    });

    res.status(200).json({ message: 'Inventory updated successfully', data: updatedInventory });
  } catch (error) {
    console.error('Error updating inventory:', error);
    res.status(500).json({ message: 'Failed to update inventory', error: error.message });
  }
};

/**
 * DELETE /api/inventory/:id
 * Delete inventory and its serial–SIM pairs
 */
export const deleteInventory = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: 'Invalid ID format' });

    const exists = await prisma.inventory.findUnique({ where: { id } });
    if (!exists) return res.status(404).json({ message: 'Inventory item not found' });

    await prisma.$transaction(async (tx) => {
      await tx.serialSim.deleteMany({ where: { inventoryId: id } });
      await tx.inventory.delete({ where: { id } });
    });

    res.status(200).json({ message: 'Inventory and serial–SIM pairs deleted successfully' });
  } catch (error) {
    console.error('Error deleting inventory:', error);
    res.status(500).json({ message: 'Failed to delete inventory', error: error.message });
  }
};
