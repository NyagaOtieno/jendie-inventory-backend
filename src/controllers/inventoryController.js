import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/inventory
 * Fetch all inventory items with dealer details
 */
export const getAllInventory = async (req, res) => {
  try {
    const inventory = await prisma.inventory.findMany({
      include: { dealer: true },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(inventory);
  } catch (error) {
    console.error('Error fetching inventory list:', error);
    return res.status(500).json({
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
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid or missing inventory ID' });
    }

    const item = await prisma.inventory.findUnique({
      where: { id },
      include: { dealer: true },
    });

    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    return res.status(200).json(item);
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    return res.status(500).json({
      message: 'Failed to fetch inventory item',
      error: error.message,
    });
  }
};

/**
 * POST /api/inventory
 * Create a new inventory record
 */
export const createInventory = async (req, res) => {
  try {
    const { name, quantity, price, serialNumber, dealerId } = req.body;

    // Basic validation
    if (!name || !serialNumber || !dealerId) {
      return res.status(400).json({
        message: 'Missing required fields: name, serialNumber, dealerId',
      });
    }

    const newItem = await prisma.inventory.create({
      data: {
        name,
        quantity: quantity ? parseInt(quantity) : 0,
        price: price ? parseFloat(price) : 0,
        serialNumber,
        dealerId: parseInt(dealerId),
      },
      include: { dealer: true },
    });

    return res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating inventory item:', error);
    return res.status(500).json({
      message: 'Failed to create inventory item',
      error: error.message,
    });
  }
};

/**
 * PUT /api/inventory/:id
 * Update an existing inventory record
 */
export const updateInventory = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, quantity, price, dealerId } = req.body;

    const updated = await prisma.inventory.update({
      where: { id },
      data: {
        name,
        quantity: quantity ? parseInt(quantity) : undefined,
        price: price ? parseFloat(price) : undefined,
        dealerId: dealerId ? parseInt(dealerId) : undefined,
      },
      include: { dealer: true },
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating inventory:', error);
    return res.status(500).json({
      message: 'Failed to update inventory item',
      error: error.message,
    });
  }
};

/**
 * DELETE /api/inventory/:id
 * Delete a single inventory record
 */
export const deleteInventory = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    await prisma.inventory.delete({ where: { id } });
    return res.status(200).json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    console.error('Error deleting inventory:', error);
    return res.status(500).json({
      message: 'Failed to delete inventory item',
      error: error.message,
    });
  }
};
