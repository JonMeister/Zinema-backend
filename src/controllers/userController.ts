import { Request, Response } from "express";
import { userDAO } from "../dao/userDAO";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { emailService } from "../services/emailService";

/** Regex used to validate email format. */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Regex used to validate password strength. */
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

/** Number of salt rounds used for bcrypt hashing. */
const SALT_ROUNDS = 10;

/**
 * Extends the standard Express `Request` type to include user information
 * extracted from a verified JWT token.
 */
export interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string };
}

/**
 * Controller responsible for all user-related operations:
 * registration, authentication, profile retrieval, updates, and deletion.
 */
export class UserController {
  private dao = userDAO;

  /**
   * Registers a new user in the database.
   *
   * Validates required fields, email format, and password strength.
   * If validation passes, it hashes the password and stores the new user.
   *
   * @param req - Express request containing user data (`email`, `password`, `confirmPassword`, etc.)
   * @param res - Express response used to send the HTTP result.
   * @returns Sends a JSON response with the new user's ID or an error message.
   */
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
          "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character",
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

      res.status(201).json({ userId: user._id });
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
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  /**
   * Logs in an existing user.
   *
   * Validates the email and password against the database,
   * and returns a signed JWT token if successful.
   *
   * @param req - Express request containing `email` and `password`.
   * @param res - Express response used to send the token or error message.
   * @returns A JSON object containing `{ token }` if authentication succeeds.
   */
  async loginUser(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "All fields are required" });
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

      res.status(200).json({ token });
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.log("Login error:", err.message);
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Retrieves the profile of the currently authenticated user.
   *
   * Requires a valid JWT token (decoded via authentication middleware).
   * Returns basic profile data.
   *
   * @param req - Authenticated request containing `req.user.id`.
   * @param res - Express response returning the user data or an error.
   * @returns A JSON object with the user profile.
   */
  async getUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const user = await this.dao.findById(userId);

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.log("Get user error:", err.message);
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Updates the authenticated user's profile.
   *
   * Only fields allowed by the model schema can be updated.
   * If a password is provided, it must be confirmed via `confirmPassword`.
   *
   * @param req - Authenticated request containing updated user fields.
   * @param res - Express response with a success or error message.
   * @returns A success message if the update completes successfully.
   */
  async updateUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { password, confirmPassword } = req.body;
      const userId = req.user!.id;

      const user = await this.dao.findById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      if (password && password !== confirmPassword) {
        res.status(400).json({ message: "Passwords do not match" });
        return;
      }
        console.log("Login error: " + err.message);

      // If password is being updated, validate and hash it
      if (password) {
        if (!PASSWORD_REGEX.test(password)) {
          res.status(400).json({ message: "Password does not meet complexity requirements" });
          return;
        }
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        req.body.password = hashedPassword;
      }
      await this.dao.update(userId, req.body);

      res.status(200).json({ message: "Profile successfully updated" });
    } catch (err: any) {
      if (err.code === 11000) {
        res.status(409).json({ message: "Email already exists" });
      } else if (err.name === "ValidationError") {
        res.status(400).json({ message: err.message });
      } else {
        if (process.env.NODE_ENV === "development") {
          console.log("Update user error:", err.message);
        }
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  /**
   * Deletes the authenticated user's account.
   *
   * Permanently removes the user document from the database.
   *
   * @param req - Authenticated request containing the user ID (`req.user.id`).
   * @param res - Express response confirming deletion or returning an error.
   * @returns A JSON message confirming account deletion.
   */
  async deleteUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      const user = await this.dao.findById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      await this.dao.delete(userId);
      res.status(200).json({ message: "Profile successfully deleted" });
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.log("Delete user error:", err.message);
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

/** Singleton instance of the UserController. */
export const userController = new UserController();
