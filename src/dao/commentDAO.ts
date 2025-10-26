import { Comment, IComment } from "../models/commentModel";

/**
 * Data Access Object (DAO) for the Comment model.
 */
export class CommentDAO {
  /**
   * Create a new comment.
   */
  async create(data: Partial<IComment>): Promise<IComment> {
    const comment = new Comment(data);
    return comment.save();
  }

  /**
   * Delete a comment by ID.
   */
  async delete(id: string): Promise<(IComment) | null> {
    return Comment.findByIdAndDelete(id).exec();
  }

  /**
  * Find all comments by user ID.
  */
  async findByUserId(userId: string): Promise<(IComment)[]> {
    return Comment.find({ userId }).exec();
  }

  /**
  * Find a comment by its _id.
  */
  async findById(id: string): Promise<IComment | null> {
    return Comment.findById(id).exec();
  }

  /**
   * Find all comments by video ID and user ID.
   */
  async findAllByVideoAndUser(videoId: string, userId: string): Promise<IComment[]> {
    return Comment.find({ videoId, userId }).exec();
  }

  /**
   * Find a single comment by video ID and user ID.
   */
  async findByVideoAndUser(videoId: string, userId: string): Promise<IComment | null> {
    return Comment.findOne({ videoId, userId }).exec();
  }

  /**
   * Update a comment’s content by its ID.
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
