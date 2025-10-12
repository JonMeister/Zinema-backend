import { Request, Response } from "express";
import { userDAO } from "../dao/userDAO";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
      const user = await this.dao.create({ ...rest, email, password: hashedPassword });
      res.status(201).json(user._id);
    } catch (err: any) {
      if (err.code === 11000) {
        res.status(409).json({ message: "Email already exists" });
      } else if (err.name === "ValidationError") {
        res.status(400).json({ message: err.message });
      } else {
        if (process.env.NODE_ENV === "development") {
          console.log("Register error: " + err.message)

          res.status(500).json({ message: "Internal server error" });
        }
      }
    }
  }
}

/**
 * Singleton instance
 */
export const userController = new UserController();
