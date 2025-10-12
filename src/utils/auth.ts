import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface JwtPayloadCustom extends JwtPayload {
  id: string;
  email: string;
}

interface AuthenticatedRequest extends Request {
  user?: JwtPayloadCustom;
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token missing" });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("❌ JWT_SECRET not defined in environment variables.");
    res.status(500).json({ message: "Server misconfiguration" });
    return;
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err || !decoded) {
      res.status(403).json({ message: "Invalid token" });
      return;
    }

    if (typeof decoded === "object" && "id" in decoded && "email" in decoded) {
      req.user = decoded as JwtPayloadCustom;
      next();
    } else {
      res.status(403).json({ message: "Malformed token payload" });
    }
  });
}
