import { Router, Response } from "express";
import { Product } from "../models/Product";
import { requireAuth, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// Create product
router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const product = new Product({ ...req.body, user: req.user?.id });
    await product.save();
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get products
router.get("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const products = await Product.find({ user: req.user?.id }).sort({ name: 1 });
    
    const mappedProducts = products.map(product => {
      const p = product.toObject();
      return { ...p, id: p._id };
    });
    
    res.json(mappedProducts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
