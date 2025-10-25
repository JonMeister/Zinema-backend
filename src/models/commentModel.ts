import mongoose, { Types, Document } from "mongoose";

/**
 * Interface representing a Comment document in MongoDB.
 *
 * Each comment associates a user with a specific video and contains
 * the textual content of the user's message. The `userId` references
 * the user who made the comment, and `videoId` identifies the target video.
 */
export interface IComment extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId | string;
  videoId: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Comment schema definition.
 *
 * Defines the structure of comment documents in MongoDB,
 * linking users and videos along with the text content of each comment.
 * Includes validation constraints for minimum and maximum content length,
 * and automatically manages creation and update timestamps.
 */
const CommentSchema = new mongoose.Schema<IComment>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    videoId: { type: String, required: true },
    content: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 100,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Compound index ensuring that each user can only post one comment
 * per video. This prevents duplicate comment entries for the same
 * (userId, videoId) pair.
 */
CommentSchema.index({ userId: 1, videoId: 1 }, { unique: true });

/**
 * Mongoose model for the Comment collection.
 * Provides an interface to interact with user-video comment relationships.
 */
export const Comment = mongoose.model<IComment>("Comment", CommentSchema);
