import { Request, Response } from "express";
import { userDAO } from "../dao/userDAO";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { emailService } from "../services/emailService";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const SALT_ROUNDS = 10;

/**
 * Controller for User operations.
 */
export class UserController {
  private dao = userDAO;

  async registerUser(req: Request, res: Response): Promise<void> {
    const { password, confirmPassword, email, ...rest } = req.body;

    if (!email || !password || !confirmPassword) {
      res.status(400).json({ message: "All fields are required" });

      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      res.status(400).json({ message: "Invalid email format" });

      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      res.status(400).json({
        message:
          "Password must have at least 8 characters long, 1 uppercase, 1 lowercase, 1 number and 1 special character",
      });

      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ message: "Passwords do not match" });

      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const user = await this.dao.create({ ...rest, email, password: hashedPassword });
      res.status(201).json(user._id);
    } catch (err: any) {
      if (err.code === 11000) {
        res.status(409).json({ message: "Email already exists" });
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
      res.status(400).json({ message: "Email and password required" });
      return;
    }

    try {
      const user = await this.dao.findByEmail(email);
      if (!user) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET || "",
        { expiresIn: "2h" }
      );

      res.status(200).json(token);
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.log("Login error: " + err.message);

        res.status(500).json({ message: "Internal server error" });
      }
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
