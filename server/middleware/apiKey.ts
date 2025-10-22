import { Request, Response, NextFunction } from "express";

export function requireChatApiKey(req: Request, res: Response, next: NextFunction) {
  const expected = process.env.CHAT_API_KEY;
  if (!expected) return res.status(500).json({ error: "CHAT_API_KEY not set" });

  const got = req.header("x-api-key");
  if (!got || got !== expected) {
    return res.status(401).json({ error: "Invalid or missing x-api-key" });
  }
  next();
}
