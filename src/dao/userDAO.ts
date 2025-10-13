import { Document } from "mongoose";
import { User, IUser } from "../models/userModel";

/**
 * Data Access Object (DAO) for the User model.
 */
export class UserDAO {
  /**
   * Create a new user.
   */
  async create(data: Partial<IUser>): Promise<IUser & Document> {
    const user = new User(data);
    return user.save();
  }

  /**
   * Find a user by email.
   */
  async findByEmail(email: string): Promise<(IUser & Document) | null> {
    return User.findOne({ email }).exec();
  }

  /**
   * Find a user by ID.
   */
  async findById(id: string): Promise<(IUser & Document) | null> {
    return User.findById(id).exec();
  }

  /**
   * Update a user by ID.
   */
  async update(id: string, data: Partial<IUser>): Promise<(IUser & Document) | null> {
    return User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  }

  /**
   * Delete a user by ID.
   */
  async delete(id: string): Promise<(IUser & Document) | null> {
    return User.findByIdAndDelete(id).exec();
  }
}

/**
 * Singleton instance
 */
export const userDAO = new UserDAO();
