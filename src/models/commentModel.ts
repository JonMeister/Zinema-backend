import mongoose, { Types } from "mongoose";

export interface IComment {
  userId: Types.ObjectId;
  videoId: string;
  content: string;
}

const CommentSchema = new mongoose.Schema<IComment>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, trim: true },
    videoId: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);


export const Comment = mongoose.model<IComment>("Comment", CommentSchema);
