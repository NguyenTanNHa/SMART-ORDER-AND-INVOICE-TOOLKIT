import { Router, Response } from "express";
import { Order } from "../models/Order";
import { requireAuth, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// Create order
router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const order = new Order({ ...req.body, user: req.user?.id });
    await order.save();
    res.status(201).json(order);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get orders
router.get("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { search } = req.query;
    let query: any = { user: req.user?.id };
    
    if (search) {
      query.$or = [
        { customerName: { $regex: search as string, $options: "i" } },
        { phone: { $regex: search as string, $options: "i" } },
        { customerEmail: { $regex: search as string, $options: "i" } }
      ];
    }
    
    const orders = await Order.find(query).sort({ createdAt: -1 });
    
    const mappedOrders = orders.map(order => {
      const o = order.toObject();
      return { ...o, id: o._id };
    });
    
    res.json(mappedOrders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status
router.put("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, user: req.user?.id },
      { $set: req.body },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Delete order
router.delete("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findOneAndDelete({ _id: req.params.id, user: req.user?.id });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ message: "Order deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
