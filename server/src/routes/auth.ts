import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-me";

router.post("/register", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Save user
    const newUser = new User({ email, passwordHash });
    await newUser.save();

    // Generate token
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: newUser._id, email: newUser.email }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
