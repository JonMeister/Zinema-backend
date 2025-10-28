import { Rating, IRating } from "../models/ratingModel";

/**
 * Data Access Object (DAO) for the Rating model.
 */
export class RatingDAO {
  /**
   * Create a new rating.
   */
  async create(data: Partial<IRating>): Promise<IRating> {
    const rating = new Rating(data);
    return rating.save();
  }

  /**
   * Delete a rating by ID.
   */
  async delete(id: string): Promise<(IRating) | null> {
    return Rating.findByIdAndDelete(id).exec();
  }

  /**
  * Find all ratings by user ID.
  */
  async findByUserId(userId: string): Promise<(IRating)[]> {
    return Rating.find({ userId }).exec();
  }

  /**
  * Find a rating by video ID and user ID.
  */
  async findByVideoAndUser(videoId: string, userId: string): Promise<(IRating) | null> {
    return Rating.findOne({ videoId, userId }).exec();
  }

  /**
   * Find all comments by video ID and user ID.
   */
  async findAllByVideoAndUser(videoId: string, userId: string): Promise<IRating[]> {
    return Rating.find({ videoId, userId }).exec();
  }

  /**
   * Find all ratings by video ID.
   */
  async findAllByVideo(videoId: string): Promise<IRating[]> {
    return Rating.find({ videoId }).exec();
  }

  /**
   * Update a rating's stars by its ID.
   */
  async update(id: string, stars: number): Promise<IRating | null> {
    return Rating.findByIdAndUpdate(
      id,
      { stars },
      { new: true }
    ).exec();
  }
}

/**
 * Singleton instance
 */
export const ratingDAO = new RatingDAO();
