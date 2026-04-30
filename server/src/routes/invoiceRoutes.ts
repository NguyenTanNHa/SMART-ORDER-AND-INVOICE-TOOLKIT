import { Router, Response } from "express";
import { Invoice } from "../models/Invoice";
import { requireAuth, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// Create invoice
router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const invoice = new Invoice({ ...req.body, user: req.user?.id });
    await invoice.save();
    res.status(201).json(invoice);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get invoices
router.get("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const invoices = await Invoice.find({ user: req.user?.id }).sort({ createdAt: -1 });
    
    const mappedInvoices = invoices.map(invoice => {
      const i = invoice.toObject();
      return { ...i, id: i._id };
    });
    
    res.json(mappedInvoices);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update invoice
router.put("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, user: req.user?.id },
      { $set: req.body },
      { new: true }
    );
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.json(invoice);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Delete invoice
router.delete("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const invoice = await Invoice.findOneAndDelete({ _id: req.params.id, user: req.user?.id });
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.json({ message: "Invoice deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
