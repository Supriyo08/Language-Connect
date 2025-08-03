import mongoose, { Document, Schema } from 'mongoose';

// User Profile Schema
export interface IUserProfile extends Document {
  name: string;
  email: string;
  password?: string;
  nativeLanguages: string[];
  targetLanguages: string[];
  experienceLevel: string;
  profilePicture?: string;
  videoIntro?: string;
  referralId: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserProfileSchema = new Schema<IUserProfile>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  nativeLanguages: [{ type: String, required: true }],
  targetLanguages: [{ type: String, required: true }],
  experienceLevel: { 
    type: String, 
    required: true,
    enum: ['beginner', 'intermediate', 'advanced', 'native']
  },
  profilePicture: { type: String },
  videoIntro: { type: String },
  referralId: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Contest Entry Schema
export interface IContestEntry extends Document {
  userId: mongoose.Types.ObjectId;
  language: string;
  region: string;
  caption: string;
  videoUrl: string;
  votes: number;
  rating: number;
  createdAt: Date;
}

const ContestEntrySchema = new Schema<IContestEntry>({
  userId: { type: Schema.Types.ObjectId, ref: 'UserProfile', required: true },
  language: { type: String, required: true },
  region: { type: String, required: true },
  caption: { type: String, required: true },
  videoUrl: { type: String, required: true },
  votes: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Raffle Entry Schema
export interface IRaffleEntry extends Document {
  userId: mongoose.Types.ObjectId;
  referralId: string;
  referredUserId: mongoose.Types.ObjectId;
  ticketsEarned: number;
  createdAt: Date;
}

const RaffleEntrySchema = new Schema<IRaffleEntry>({
  userId: { type: Schema.Types.ObjectId, ref: 'UserProfile', required: true },
  referralId: { type: String, required: true },
  referredUserId: { type: Schema.Types.ObjectId, ref: 'UserProfile', required: true },
  ticketsEarned: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

// Export models
export const UserProfile = mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);
export const ContestEntry = mongoose.model<IContestEntry>('ContestEntry', ContestEntrySchema);
export const RaffleEntry = mongoose.model<IRaffleEntry>('RaffleEntry', RaffleEntrySchema);
