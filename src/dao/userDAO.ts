import { Document } from "mongoose";
import { User, IUser } from "../models/userModel";

/**
 * Data Access Object (DAO) for the User model.
<<<<<<< HEAD
 */
export class UserDAO {
  /**
   * Create a new user.
=======
 * 
 * Provides a clean interface for all database operations related to users,
 * including CRUD operations and password reset functionality.
 */
export class UserDAO {
  /**
   * Creates a new user in the database.
   * 
   * @param data - Partial user data to create the new user with.
   * @returns Promise resolving to the created user document.
   * @throws Will throw validation errors if data doesn't match schema requirements.
>>>>>>> 39b47680c3c12a819cebee4728e04d20c7033b3d
   */
  async create(data: Partial<IUser>): Promise<IUser & Document> {
    const user = new User(data);
    return user.save();
  }

  /**
<<<<<<< HEAD
   * Find a user by email.
=======
   * Finds a user by their email address.
   * 
   * @param email - The email address to search for.
   * @returns Promise resolving to the user document or null if not found.
>>>>>>> 39b47680c3c12a819cebee4728e04d20c7033b3d
   */
  async findByEmail(email: string): Promise<(IUser & Document) | null> {
    return User.findOne({ email }).exec();
  }

  /**
<<<<<<< HEAD
   * Find a user by ID.
=======
   * Finds a user by their unique ID.
   * 
   * @param id - The MongoDB ObjectId of the user.
   * @returns Promise resolving to the user document or null if not found.
>>>>>>> 39b47680c3c12a819cebee4728e04d20c7033b3d
   */
  async findById(id: string): Promise<(IUser & Document) | null> {
    return User.findById(id).exec();
  }

  /**
<<<<<<< HEAD
   * Update a user by ID.
=======
   * Updates a user's data by their ID.
   * 
   * @param id - The MongoDB ObjectId of the user to update.
   * @param data - Partial user data containing the fields to update.
   * @returns Promise resolving to the updated user document or null if not found.
   * @throws Will throw validation errors if updated data doesn't match schema requirements.
>>>>>>> 39b47680c3c12a819cebee4728e04d20c7033b3d
   */
  async update(id: string, data: Partial<IUser>): Promise<(IUser & Document) | null> {
    return User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  }

  /**
<<<<<<< HEAD
   * Delete a user by ID.
=======
   * Permanently deletes a user from the database.
   * 
   * @param id - The MongoDB ObjectId of the user to delete.
   * @returns Promise resolving to the deleted user document or null if not found.
>>>>>>> 39b47680c3c12a819cebee4728e04d20c7033b3d
   */
  async delete(id: string): Promise<(IUser & Document) | null> {
    return User.findByIdAndDelete(id).exec();
  }
<<<<<<< HEAD
=======

  /**
   * Finds a user by their password reset token.
   * 
   * Only returns users with valid (non-expired) reset tokens.
   * 
   * @param token - The reset password token to search for.
   * @returns Promise resolving to the user document or null if not found or token expired.
   */
  async findByResetToken(token: string): Promise<(IUser & Document) | null> {
    return User.findOne({ 
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    }).exec();
  }

  /**
   * Sets a password reset token and expiration date for a user.
   * 
   * @param email - The email address of the user to set the token for.
   * @param token - The reset password token to store.
   * @param expiresAt - The date when the token should expire.
   * @returns Promise resolving to the updated user document or null if user not found.
   */
  async setResetToken(email: string, token: string, expiresAt: Date): Promise<(IUser & Document) | null> {
    return User.findOneAndUpdate(
      { email },
      { 
        resetPasswordToken: token,
        resetPasswordExpires: expiresAt
      },
      { new: true }
    ).exec();
  }

  /**
   * Clears the password reset token and expiration date for a user.
   * 
   * @param userId - The MongoDB ObjectId of the user to clear the token for.
   * @returns Promise resolving to the updated user document or null if not found.
   */
  async clearResetToken(userId: string): Promise<(IUser & Document) | null> {
    return User.findByIdAndUpdate(
      userId,
      { 
        $unset: { 
          resetPasswordToken: 1,
          resetPasswordExpires: 1
        }
      },
      { new: true }
    ).exec();
  }
>>>>>>> 39b47680c3c12a819cebee4728e04d20c7033b3d
}

/**
 * Singleton instance
 */
export const userDAO = new UserDAO();
