import { Router, Response } from "express";
import { Profile } from "../models/Profile";
import { requireAuth, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// Get profile
router.get("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    let profile = await Profile.findOne({ user: req.user?.id });
    if (!profile) {
      // Auto-create empty profile
      profile = new Profile({ user: req.user?.id });
      await profile.save();
    }
    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update profile
router.put("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user?.id },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
