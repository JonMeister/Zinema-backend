import mongoose, { Types } from "mongoose";

export interface IRating {
  userId: Types.ObjectId;
  videoId: string;
  stars: number;
}

const RatingSchema = new mongoose.Schema<IRating>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    videoId: { type: String, required: true, trim: true },
    stars: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export const Rating = mongoose.model<IRating>("Rating", RatingSchema);
