import { Document } from "mongoose";
import { Favorite, IFavorite } from "../models/favoriteModel";

/**
 * Data Access Object (DAO) for the Favorite model.
 */
export class FavoriteDAO {
  /**
   * Create a new favorite.
   */
  async create(data: Partial<IFavorite>): Promise<IFavorite & Document> {
    const favorite = new Favorite(data);
    return favorite.save();
  }

  /**
   * Delete a favorite by ID.
   */
  async delete(id: string): Promise<(IFavorite & Document) | null> {
    return Favorite.findByIdAndDelete(id).exec();
  }

  /**
  * Find all favorites by user ID.
  */
  async findByUserId(userId: string): Promise<(IFavorite & Document)[]> {
    return Favorite.find({ userId }).exec();
  }

  /**
  * Find a favorite by video ID and user ID.
  */
  async findByVideoAndUser(videoId: string, userId: string): Promise<(IFavorite & Document) | null> {
    return Favorite.findOne({ videoId, userId }).exec();
  }
}

/**
 * Singleton instance
 */
export const favoriteDAO = new FavoriteDAO();
