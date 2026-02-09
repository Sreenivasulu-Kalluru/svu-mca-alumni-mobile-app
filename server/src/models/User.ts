import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Optional if using OAuth later, but required for now
  role: 'student' | 'alumni' | 'admin';
  profilePicture?: string;
  bio?: string;
  location?: string;
  contactNumber?: string;

  // Education Details (For both)
  batch: string; // e.g., "2023-2025"
  rollNumber?: string; // Mostly for students

  // Professional Details (Mostly for Alumni)
  currentCompany?: string;
  designation?: string;
  industry?: string;
  skills: string[];

  // Social Links
  linkedinProfile?: string;
  githubProfile?: string;
  website?: string;

  createdAt: Date;
  updatedAt: Date;

  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['student', 'alumni', 'admin'],
      default: 'student',
    },
    profilePicture: { type: String },
    bio: { type: String },
    location: { type: String },
    contactNumber: { type: String },

    batch: { type: String, required: true }, // Important for finding batchmates
    rollNumber: { type: String },

    currentCompany: { type: String },
    designation: { type: String },
    industry: { type: String },
    skills: [{ type: String }],

    linkedinProfile: { type: String },
    githubProfile: { type: String },
    website: { type: String },

    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
