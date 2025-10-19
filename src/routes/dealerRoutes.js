import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
  const dealers = await prisma.dealer.findMany({ include: { inventory: true } });
  res.json(dealers);
});

router.post("/", async (req, res) => {
  try {
    const dealer = await prisma.dealer.create({ data: req.body });
    res.status(201).json(dealer);
  } catch (error) {
    console.error("Dealer error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
