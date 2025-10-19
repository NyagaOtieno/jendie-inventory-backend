import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import dealerRoutes from "./routes/dealer.js";
import inventoryRoutes from "./routes/inventory.js";
import saleRoutes from "./routes/sale.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/dealers", dealerRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/sales", saleRoutes);

app.get("/", (req, res) => res.send("✅ Jendie Inventory Backend API is live"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
