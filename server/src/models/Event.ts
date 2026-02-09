import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  location: string; // Physical or Virtual Link
  organizer: mongoose.Types.ObjectId; // User (Admin or Alumni)
  type: 'Reunion' | 'Workshop' | 'Webinar' | 'Meetup';
  attendees: mongoose.Types.ObjectId[];
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['Reunion', 'Workshop', 'Webinar', 'Meetup'],
      default: 'Meetup',
    },
    attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    image: { type: String },
  },
  { timestamps: true }
);

export const Event = mongoose.model<IEvent>('Event', EventSchema);
