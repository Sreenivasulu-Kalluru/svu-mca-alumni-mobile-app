import mongoose, { Document, Schema } from 'mongoose';

export interface ISuccessStory extends Document {
  user: mongoose.Schema.Types.ObjectId;
  name: string;
  role: string;
  company: string;
  content: string;
  image?: string;
  linkedinProfile?: string;
  status: 'pending' | 'approved';
  createdAt: Date;
}

const successStorySchema = new Schema<ISuccessStory>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true },
    role: { type: String, required: true },
    company: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
    linkedinProfile: { type: String },
    status: {
      type: String,
      enum: ['pending', 'approved'],
      default: 'approved',
    },
  },
  { timestamps: true }
);

export default mongoose.model<ISuccessStory>(
  'SuccessStory',
  successStorySchema
);
