import mongoose, { Types, Document } from "mongoose";

/**
 * Interface representing a Favorite document in MongoDB.
 *
 * Each favorite associates a user with a specific video.
 * The `userId` references the user who favorited the video,
 * and `videoId` identifies the target video.
 */
export interface IFavorite extends Document {
  userId: Types.ObjectId | string;
  videoId: string;
}

/**
 * Favorite schema definition.
 *
 * Defines the structure of favorite documents in MongoDB,
 * linking users and videos with automatic timestamps.
 * A compound unique index prevents the same user from
 * favoriting the same video more than once.
 */
const FavoriteSchema = new mongoose.Schema<IFavorite>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    videoId: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

/**
 * Compound index ensuring that each (userId, videoId) pair is unique.
 */
FavoriteSchema.index({ userId: 1, videoId: 1 }, { unique: true });

/**
 * Mongoose model for the Favorite collection.
 * Provides an interface to interact with user-video favorite relationships.
 */
export const Favorite = mongoose.model<IFavorite>("Favorite", FavoriteSchema);
