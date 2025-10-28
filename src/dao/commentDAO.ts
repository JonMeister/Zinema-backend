import { Comment, IComment } from "../models/commentModel";

/**
 * Data Access Object (DAO) for the Comment model.
 * Provides methods for creating, reading, updating, and deleting video comments.
 */
export class CommentDAO {
  /**
   * Creates a new comment in the database.
   * 
   * @param data - Partial comment data to create the comment with.
   * @returns Promise resolving to the created comment document.
   */
  async create(data: Partial<IComment>): Promise<IComment> {
    const comment = new Comment(data);
    return comment.save();
  }

  /**
   * Deletes a comment by its unique ID.
   * 
   * @param id - The MongoDB ObjectId of the comment to delete.
   * @returns Promise resolving to the deleted comment or null if not found.
   */
  async delete(id: string): Promise<(IComment) | null> {
    return Comment.findByIdAndDelete(id).exec();
  }

  /**
   * Retrieves all comments made by a specific user.
   * 
   * @param userId - The ID of the user whose comments to retrieve.
   * @returns Promise resolving to an array of comment documents.
   */
  async findByUserId(userId: string): Promise<(IComment)[]> {
    return Comment.find({ userId }).exec();
  }

  /**
   * Retrieves a comment by its unique ID.
   * 
   * @param id - The MongoDB ObjectId of the comment.
   * @returns Promise resolving to the comment document or null if not found.
   */
  async findById(id: string): Promise<IComment | null> {
    return Comment.findById(id).exec();
  }

  /**
   * Retrieves all comments made by a specific user on a specific video.
   * 
   * @param videoId - The ID of the video.
   * @param userId - The ID of the user.
   * @returns Promise resolving to an array of comment documents.
   */
  async findAllByVideoAndUser(videoId: string, userId: string): Promise<IComment[]> {
    return Comment.find({ videoId, userId }).exec();
  }

  /**
   * Retrieves a comment made by a specific user on a specific video.
   * Populates the userId field with the user's firstName for display purposes.
   * 
   * @param videoId - The ID of the video to check.
   * @param userId - The ID of the user to check.
   * @returns The comment object with populated user data if found, or null otherwise.
   */
  async findByVideoAndUser(videoId: string, userId: string): Promise<IComment | null> {
    return Comment.findOne({ videoId, userId }).populate('userId', 'firstName').exec();
  }

  /**
   * Retrieves all comments made for a specific video.
   * Populates the userId field with the user's firstName for each comment.
   * This allows displaying the commenter's name without additional queries.
   * 
   * @param videoId - The ID of the video to retrieve comments for.
   * @returns Array of comment objects with populated user data (firstName).
   */
  async findAllByVideo(videoId: string): Promise<IComment[]> {
    return Comment.find({ videoId }).populate('userId', 'firstName').exec();
  }

  /**
   * Updates a comment's content by its ID.
   * 
   * @param id - The MongoDB ObjectId of the comment to update.
   * @param content - The new content text for the comment.
   * @returns Promise resolving to the updated comment document or null if not found.
   */
  async update(id: string, content: string): Promise<IComment | null> {
    return Comment.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    ).exec();
  }
}

/**
 * Singleton instance
 */
export const commentDAO = new CommentDAO();
