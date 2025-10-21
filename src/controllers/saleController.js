// src/controllers/saleController.js
const prisma = require('../prismaClient');

/**
 * ✅ Create Sale
 * Supports dealer or direct sale
 * Rolls back inventory if any step fails
 */
const createSale = async (req, res) => {
  const { dealerId, clientName, salePrice, saleDate, items, userId } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ message: 'No sale items provided.' });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Validate and update all inventory items
      const updatedInventory = [];

      for (const item of items) {
        const inventoryItem = await tx.inventory.findFirst({
          where: {
            serialNumber: item.serialNumber,
            simNumber: item.simCardNumber,
            status: 'available',
          },
        });

        if (!inventoryItem) {
          throw new Error(`Inventory item not found or already sold: ${item.serialNumber}`);
        }

        const updated = await tx.inventory.update({
          where: { id: inventoryItem.id },
          data: { status: 'sold' },
        });

        updatedInventory.push(updated);
      }

      // Calculate total sale price
      const totalPrice = parseFloat(salePrice);

      // Create sale record
      const sale = await tx.sale.create({
        data: {
          dealerId: dealerId ? parseInt(dealerId) : null,
          clientName,
          totalPrice,
          saleDate: new Date(saleDate),
          userId: userId || null,
          negotiatedPrice: totalPrice,
        },
      });

      // Link sale items
      for (const inv of updatedInventory) {
        await tx.saleItem.create({
          data: {
            saleId: sale.id,
            inventoryId: inv.id,
          },
        });
      }

      return sale;
    });

    res.status(201).json({
      message: 'Sale created successfully',
      data: result,
    });
  } catch (err) {
    console.error('❌ Sale creation failed:', err);
    res.status(500).json({
      message: 'Sale creation failed. Inventory rollback applied.',
      error: err.message,
    });
  }
};

/**
 * ✅ Get all sales
 */
const getSales = async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        dealer: true,
        saleItems: {
          include: { inventory: true },
        },
      },
      orderBy: { saleDate: 'desc' },
    });

    res.status(200).json(sales);
  } catch (err) {
    console.error('❌ Error fetching sales:', err);
    res.status(500).json({ message: 'Failed to fetch sales.' });
  }
};

module.exports = { createSale, getSales };
