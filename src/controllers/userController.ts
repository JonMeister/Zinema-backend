import { Request, Response } from "express";
import { userDAO } from "../dao/userDAO";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { emailService } from "../services/emailService";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const SALT_ROUNDS = 10;

export interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string };
}

/**
 * Controller for User operations.
 */
export class UserController {
  private dao = userDAO;

  async registerUser(req: Request, res: Response): Promise<void> {
    const { password, confirmPassword, email, ...rest } = req.body;

    if (!email || !password || !confirmPassword) {
      res.status(400).json({ message: "Todos los campos son requeridos" });

      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      res.status(400).json({ message: "Formato de email inválido" });

      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      res.status(400).json({
        message:
          "La contraseña debe contener al menos 8 caracteres, 1 mayúscula, 1 minúscula y 1 caracter especial",
      });

      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ message: "Las contraseñas no coinciden" });

      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const user = await this.dao.create({ ...rest, email, password: hashedPassword });

      res.status(201).json({ userId: user._id });
    } catch (err: any) {
      if (err.code === 11000) {
        res.status(409).json({ message: "El email ya existe" });

      } else if (err.name === "ValidationError") {
        res.status(400).json({ message: err.message });

      } else {
        if (process.env.NODE_ENV === "development") {
          console.log("Register error: " + err.message);

          res.status(500).json({ message: "Internal server error" });
        }
      }
    }
  }

  async loginUser(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Todos los campos son requeridos" });

      return;
    }

    try {
      const user = await this.dao.findByEmail(email);
      if (!user) {
        res.status(401).json({ message: "Email o contraseña inválidos" });

        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ message: "Email o contraseña inválidos" });

        return;
      }

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET || "",
        { expiresIn: "2h" }
      );

      res.status(200).json({ token: token });
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.log("Login error: " + err.message);

        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  /**
   * Retrieves the profile information of the currently authenticated user.
   *
   * Requires authentication via {@link authenticateToken}.
   *
   * @async
   * @param {import("express").Request} req - Express request object, `req.user` contains decoded JWT info
   * @param {import("express").Response} res - Express response object
   * @returns {Promise<void>} Returns HTTP status codes:
   *   - 200: Returns user profile `{ firstName, lastName, age, email }`
   *   - 404: User not found
   *   - 500: Internal server error
   */
  async getUser(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;

      const user = await this.dao.findById(userId);
      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });

        return;
      }

      res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.log("Get user error: " + err.message)

        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  /**
   * Updates the profile of the authenticated user.
   *
   * Retrieves the user ID from the decoded JWT token (`req.user.id`) and
   * updates the user's document in the database with the data provided
   * in `req.body`. Only updates fields allowed by the model validators.
   *
   * @async
   * @param {import("express").Request} req - Express request object. The body should
   * contain the fields to update (e.g., firstName, lastName, age, email, password).
   * @param {import("express").Response} res - Express response object.
   * @returns {Promise<void>} Sends a JSON response with a success message or an error.
   */
  async updateUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { password, confirmPassword } = req.body;
      const userId = req.user!.id;

      const user = await this.dao.findById(userId);
      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });

        return;
      }

      if (password) {
        if (password !== confirmPassword) {
          res
            .status(400)
            .json({ message: "Las contraseñas no coinciden" });

          return;
        }
      }

      await this.dao.update(userId, req.body);

      res.status(200).json({
        message: "Perfil exitosamente actualizado",
      });
    } catch (err: any) {
      if (err.code === 11000) {
        res.status(409).json({ message: "El email ya existe" });

      } else if (err.name === "ValidationError") {
        res.status(400).json({ message: err.message });

      } else {
        if (process.env.NODE_ENV === "development") {
          console.log("Register error: " + err.message)

          res.status(500).json({ message: "Internal server error" });
        }
      }
  async requestPasswordReset(req: Request, res: Response): Promise<void> {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      res.status(400).json({ message: "Invalid email format" });
      return;
    }

    try {
      const user = await this.dao.findByEmail(email);
      
      // Always return success to prevent email enumeration attacks
      if (!user) {
        res.status(200).json({ 
          message: "If the email exists, a password reset link has been sent" 
        });
        return;
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Save token to database
      await this.dao.setResetToken(email, resetToken, resetExpires);

      // Generate reset link
      const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/password-reset?token=${resetToken}`;

      // Send email
      await emailService.sendRecoveryEmail(email, resetLink);

      res.status(200).json({ 
        message: "If the email exists, a password reset link has been sent" 
      });

    } catch (err: any) {
      console.error("Password reset request error:", err.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      res.status(400).json({ message: "Token, password and confirmation are required" });
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      res.status(400).json({
        message: "Password must have at least 8 characters long, 1 uppercase, 1 lowercase, 1 number and 1 special character",
      });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ message: "Passwords do not match" });
      return;
    }

    try {
      // Find user by token
      const user = await this.dao.findByResetToken(token);
      
      if (!user) {
        res.status(400).json({ message: "Invalid or expired reset token" });
        return;
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // Update password and clear reset token
      await this.dao.update(String(user._id), { password: hashedPassword });
      await this.dao.clearResetToken(String(user._id));

      res.status(200).json({ message: "Password has been reset successfully" });

    } catch (err: any) {
      console.error("Password reset error:", err.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

/**
 * Singleton instance
 */
export const userController = new UserController();
