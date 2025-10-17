import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

<<<<<<< HEAD
=======
/**
 * Extended JWT payload interface containing user information.
 */
>>>>>>> 39b47680c3c12a819cebee4728e04d20c7033b3d
interface JwtPayloadCustom extends JwtPayload {
  id: string;
  email: string;
}

<<<<<<< HEAD
=======
/**
 * Extended Express Request interface with authenticated user data.
 */
>>>>>>> 39b47680c3c12a819cebee4728e04d20c7033b3d
interface AuthenticatedRequest extends Request {
  user?: JwtPayloadCustom;
}

<<<<<<< HEAD
=======
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
>>>>>>> 39b47680c3c12a819cebee4728e04d20c7033b3d
export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
<<<<<<< HEAD
    res.status(401).json({ message: "Token missing" });
=======
    res.status(401).json({ message: "Token faltante" });
>>>>>>> 39b47680c3c12a819cebee4728e04d20c7033b3d
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
<<<<<<< HEAD
    console.error("❌ JWT_SECRET not defined in environment variables.");
    res.status(500).json({ message: "Server misconfiguration" });
=======
    console.error("JWT_SECRET not defined in environment variables.");
    res.status(500).json({ message: "Configuración incorrecta del servidor" });
>>>>>>> 39b47680c3c12a819cebee4728e04d20c7033b3d
    return;
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err || !decoded) {
<<<<<<< HEAD
      res.status(403).json({ message: "Invalid token" });
=======
      res.status(403).json({ message: "Token inválido" });
>>>>>>> 39b47680c3c12a819cebee4728e04d20c7033b3d
      return;
    }

    if (typeof decoded === "object" && "id" in decoded && "email" in decoded) {
      req.user = decoded as JwtPayloadCustom;
      next();
    } else {
<<<<<<< HEAD
      res.status(403).json({ message: "Malformed token payload" });
=======
      res.status(403).json({ message: "Token con formato incorrecto" });
>>>>>>> 39b47680c3c12a819cebee4728e04d20c7033b3d
    }
  });
}
