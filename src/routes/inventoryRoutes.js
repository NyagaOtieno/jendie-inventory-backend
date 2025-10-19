import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
  const inventory = await prisma.inventory.findMany({ include: { dealer: true } });
  res.json(inventory);
});

router.post("/", async (req, res) => {
  try {
    const item = await prisma.inventory.create({ data: req.body });
    res.status(201).json(item);
  } catch (error) {
    console.error("Inventory error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
