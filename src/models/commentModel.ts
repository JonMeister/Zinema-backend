import mongoose, { Types } from "mongoose";

export interface IComment {
  userId: Types.ObjectId;
  videoId: string;
  content: string;
}

const CommentSchema = new mongoose.Schema<IComment>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    videoId: { type: String, required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);


export const Comment = mongoose.model<IComment>("Comment", CommentSchema);
