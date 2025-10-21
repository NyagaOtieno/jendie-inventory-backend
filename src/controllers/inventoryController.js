import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * GET /api/inventory
 * Fetch all inventory items (with pagination + search)
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
            { serialNumber: { contains: search, mode: 'insensitive' } },
            { simNumber: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      prisma.inventory.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.inventory.count({ where }),
    ]);

    return res.status(200).json({
      data: items,
      meta: {
        total,
        currentPage: pageNumber,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('❌ Error fetching inventory list:', error);
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

    const item = await prisma.inventory.findUnique({ where: { id } });
    if (!item) return res.status(404).json({ message: 'Inventory item not found' });

    res.status(200).json(item);
  } catch (error) {
    console.error('❌ Error fetching inventory item:', error);
    res.status(500).json({
      message: 'Failed to fetch inventory item',
      error: error.message,
    });
  }
};

/**
 * POST /api/inventory
 * Create a new inventory record (serial–SIM linked)
 */
export const createInventory = async (req, res) => {
  try {
    const { serialNumber, simNumber, model, quantity, dateAdded } = req.body;

    if (!serialNumber || !simNumber || !model || !quantity) {
      return res.status(400).json({
        message: 'Missing required fields: serialNumber, simNumber, model, quantity',
      });
    }

    // Ensure unique Serial ↔ SIM binding
    const existing = await prisma.inventory.findFirst({
      where: {
        OR: [{ serialNumber }, { simNumber }],
      },
    });

    if (existing) {
      return res.status(400).json({
        message:
          'Serial Number or SIM Card Number already exists or is linked to another device',
      });
    }

    const newItem = await prisma.inventory.create({
      data: {
        serialNumber,
        simNumber,
        model,
        quantity: Number(quantity),
        dateAdded: dateAdded ? new Date(dateAdded) : new Date(),
      },
    });

    res.status(201).json({
      message: '✅ Inventory item created successfully',
      data: newItem,
    });
  } catch (error) {
    console.error('❌ Error creating inventory item:', error);
    res.status(500).json({
      message: 'Failed to create inventory item',
      error: error.message,
    });
  }
};

/**
 * PUT /api/inventory/:id
 * Update an inventory record
 */
export const updateInventory = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: 'Invalid ID format' });

    const { serialNumber, simNumber, model, quantity, dateAdded } = req.body;

    const exists = await prisma.inventory.findUnique({ where: { id } });
    if (!exists) return res.status(404).json({ message: 'Inventory item not found' });

    // Prevent duplicates
    const duplicate = await prisma.inventory.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          { OR: [{ serialNumber }, { simNumber }] },
        ],
      },
    });

    if (duplicate) {
      return res.status(400).json({
        message: 'Serial or SIM number already assigned to another item',
      });
    }

    const updated = await prisma.inventory.update({
      where: { id },
      data: {
        serialNumber: serialNumber ?? exists.serialNumber,
        simNumber: simNumber ?? exists.simNumber,
        model: model ?? exists.model,
        quantity: quantity ? Number(quantity) : exists.quantity,
        dateAdded: dateAdded ? new Date(dateAdded) : exists.dateAdded,
      },
    });

    res.status(200).json({
      message: '✅ Inventory updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('❌ Error updating inventory:', error);
    res.status(500).json({
      message: 'Failed to update inventory item',
      error: error.message,
    });
  }
};

/**
 * DELETE /api/inventory/:id
 * Delete inventory record
 */
export const deleteInventory = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: 'Invalid ID format' });

    const exists = await prisma.inventory.findUnique({ where: { id } });
    if (!exists) return res.status(404).json({ message: 'Inventory item not found' });

    await prisma.inventory.delete({ where: { id } });

    res.status(200).json({ message: '✅ Inventory item deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting inventory:', error);
    res.status(500).json({
      message: 'Failed to delete inventory item',
      error: error.message,
    });
  }
};
