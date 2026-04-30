import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth";
import orderRoutes from "./routes/orderRoutes";
import invoiceRoutes from "./routes/invoiceRoutes";
import productRoutes from "./routes/productRoutes";
import profileRoutes from "./routes/profileRoutes";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/products", productRoutes);
app.use("/api/profile", profileRoutes);

// Basic health check route
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "API is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
