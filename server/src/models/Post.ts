import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Post = mongoose.model<IPost>('Post', postSchema);
