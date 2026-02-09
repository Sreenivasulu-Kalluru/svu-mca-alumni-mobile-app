import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Internship' | 'Remote';
  description: string;
  requirements: string[];
  postedBy: mongoose.Types.ObjectId; // Reference to Alumni
  applicationLink?: string; // External URL
  contactEmail?: string; // Or email to send CV
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship', 'Remote'],
      default: 'Full-time',
    },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    applicationLink: { type: String },
    contactEmail: { type: String },
  },
  { timestamps: true }
);

export const Job = mongoose.model<IJob>('Job', JobSchema);
