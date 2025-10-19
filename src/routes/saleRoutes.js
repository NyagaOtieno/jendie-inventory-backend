import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
  const sales = await prisma.sale.findMany({ include: { inventory: true } });
  res.json(sales);
});

router.post("/", async (req, res) => {
  try {
    const { inventoryId, quantitySold } = req.body;

    const inventory = await prisma.inventory.findUnique({ where: { id: inventoryId } });
    if (!inventory) return res.status(404).json({ message: "Item not found" });

    const totalAmount = quantitySold * inventory.price;

    const sale = await prisma.sale.create({
      data: { inventoryId, quantitySold, totalAmount },
    });

    await prisma.inventory.update({
      where: { id: inventoryId },
      data: { quantity: inventory.quantity - quantitySold },
    });

    res.status(201).json(sale);
  } catch (error) {
    console.error("Sale error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
