import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-me";

// Extend Request interface to include user
export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): any => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
};
