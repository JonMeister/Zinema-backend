import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

/**
 * Extended JWT payload interface containing user information.
 */
interface JwtPayloadCustom extends JwtPayload {
  id: string;
  email: string;
}

/**
 * Extended Express Request interface with authenticated user data.
 */
interface AuthenticatedRequest extends Request {
  user?: JwtPayloadCustom;
}

/**
 * Middleware function to authenticate JWT tokens.
 * 
 * Verifies the Bearer token from the Authorization header and extracts
 * user information (id and email) from the JWT payload. If authentication
 * succeeds, the user data is attached to the request object for use in
 * subsequent middleware and route handlers.
 * 
 * @param req - Express request object with potential Authorization header.
 * @param res - Express response object for sending error responses.
 * @param next - Express next function to continue to the next middleware.
 * @returns void - Sends error response or calls next() to continue.
 * 
 * @example
 * ```typescript
 * router.get('/protected', authenticateToken, (req, res) => {
 *   // req.user.id and req.user.email are now available
 *   res.json({ message: 'Access granted', userId: req.user.id });
 * });
 * ```
 */
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
    console.error("JWT_SECRET not defined in environment variables.");
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
