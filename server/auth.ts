import type { Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import "./types";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    fullName: string;
    isTutor: boolean;
  };
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authReq = req as AuthRequest;
  
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await storage.getUser(req.session.userId);
  if (!user) {
    req.session.destroy(() => {});
    return res.status(401).json({ message: "Unauthorized" });
  }

  authReq.user = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    isTutor: user.isTutor,
  };

  next();
}

export function requireTutor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authReq = req as AuthRequest;
  
  if (!authReq.user?.isTutor) {
    return res.status(403).json({ message: "Tutor access required" });
  }

  next();
}
