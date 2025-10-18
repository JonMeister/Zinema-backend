import mongoose, { Types } from "mongoose";

export interface IFavorite {
  userId: Types.ObjectId;
  videoId: string;
}

const FavoriteSchema = new mongoose.Schema<IFavorite>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    videoId: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

export const Favorite = mongoose.model<IFavorite>("Favorite", FavoriteSchema);
