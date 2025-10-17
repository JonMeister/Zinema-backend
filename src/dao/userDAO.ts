import { User, IUser } from "../models/userModel";

/**
 * Data Access Object (DAO) for the User model.
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
   */
  async create(data: Partial<IUser>): Promise<IUser> {
    const user = new User(data);
    return user.save();
  }

  /**
   * Finds a user by their email address.
   * 
   * @param email - The email address to search for.
   * @returns Promise resolving to the user document or null if not found.
   */
  async findByEmail(email: string): Promise<(IUser) | null> {
    return User.findOne({ email }).exec();
  }

  /**
   * Finds a user by their unique ID.
   * 
   * @param id - The MongoDB ObjectId of the user.
   * @returns Promise resolving to the user document or null if not found.
   */
  async findById(id: string): Promise<(IUser) | null> {
    return User.findById(id).exec();
  }

  /**
   * Updates a user's data by their ID.
   * 
   * @param id - The MongoDB ObjectId of the user to update.
   * @param data - Partial user data containing the fields to update.
   * @returns Promise resolving to the updated user document or null if not found.
   * @throws Will throw validation errors if updated data doesn't match schema requirements.
   */
  async update(id: string, data: Partial<IUser>): Promise<(IUser) | null> {
    return User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  }

  /**
   * Permanently deletes a user from the database.
   * 
   * @param id - The MongoDB ObjectId of the user to delete.
   * @returns Promise resolving to the deleted user document or null if not found.
   */
  async delete(id: string): Promise<(IUser) | null> {
    return User.findByIdAndDelete(id).exec();
  }

  /**
   * Finds a user by their password reset token.
   * 
   * Only returns users with valid (non-expired) reset tokens.
   * 
   * @param token - The reset password token to search for.
   * @returns Promise resolving to the user document or null if not found or token expired.
   */
  async findByResetToken(token: string): Promise<(IUser) | null> {
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
  async setResetToken(email: string, token: string, expiresAt: Date): Promise<(IUser) | null> {
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
  async clearResetToken(userId: string): Promise<(IUser) | null> {
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
}

/**
 * Singleton instance
 */
export const userDAO = new UserDAO();
