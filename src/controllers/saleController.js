// src/controllers/saleController.js
const prisma = require('../prismaClient');

/**
 * ✅ Create Sale
 * Supports dealer or direct sale
 * Marks SerialSim as sold and rolls back if any step fails
 */
const createSale = async (req, res) => {
  const { dealerId, userId, saleItems, negotiatedPrice, isDirectSale } = req.body;

  if (!saleItems || !saleItems.length) {
    return res.status(400).json({ message: 'No sale items provided.' });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const createdSales = [];

      for (const item of saleItems) {
        // 1️⃣ Find the SerialSim
        const serialSim = await tx.serialSim.findFirst({
          where: {
            serialNumber: item.serialNumber,
            simNumber: item.simNumber,
            status: 'available', // only allow available SerialSims
          },
          include: { inventory: true },
        });

        if (!serialSim) {
          throw new Error(
            `Serial-SIM pair not found or already sold: ${item.serialNumber} / ${item.simNumber}`
          );
        }

        // 2️⃣ Mark SerialSim as sold
        const updatedSerialSim = await tx.serialSim.update({
          where: { id: serialSim.id },
          data: { status: 'sold' },
        });

        // 3️⃣ Create the Sale record
        const sale = await tx.sale.create({
          data: {
            productId: serialSim.inventoryId,
            userId: userId || null,
            dealerId: dealerId ? parseInt(dealerId) : null,
            quantity: item.quantity,
            totalPrice: negotiatedPrice || 0,
            negotiatedPrice: negotiatedPrice || 0,
            serialNumber: item.serialNumber,
            simNumber: item.simNumber,
            isDirectSale: !!isDirectSale,
          },
        });

        createdSales.push({
          sale,
          serialSim: updatedSerialSim,
        });
      }

      return createdSales;
    });

    res.status(201).json({
      message: 'Sale(s) created successfully',
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
        product: true,
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(sales);
  } catch (err) {
    console.error('❌ Error fetching sales:', err);
    res.status(500).json({ message: 'Failed to fetch sales.' });
  }
};

module.exports = { createSale, getSales };
