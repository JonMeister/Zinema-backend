import mongoose, { Types, Document } from "mongoose";

/**
 * Interface representing a Rating document in MongoDB.
 *
 * Each rating associates a user with a specific video and stores
 * a numerical value representing the user's evaluation of that video.
 * The `userId` references the user who rated the video, and `videoId`
 * identifies the target video.
 */
export interface IRating extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId | string;
  videoId: string;
  stars: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Rating schema definition.
 *
 * Defines the structure of rating documents in MongoDB,
 * linking users and videos with an associated numerical score.
 * The `stars` field is validated to ensure it falls within
 * an allowed range (0–10). Timestamps are automatically
 * generated for creation and updates.
 */
const RatingSchema = new mongoose.Schema<IRating>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    videoId: { type: String, required: true, trim: true },
    stars: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Compound index ensuring that each (userId, videoId) pair is unique.
 * This prevents users from submitting multiple ratings for the same video.
 */
RatingSchema.index({ userId: 1, videoId: 1 }, { unique: true });

/**
 * Mongoose model for the Rating collection.
 * Provides an interface to interact with user-video rating relationships.
 */
export const Rating = mongoose.model<IRating>("Rating", RatingSchema);
