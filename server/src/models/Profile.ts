import mongoose, { Document, Schema, Types } from "mongoose";

const userSettingsSchema = new Schema({
  theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
  language: { type: String, default: 'en' },
  dashboardLayout: { type: Array, default: [] }
}, { _id: false });

export interface IProfile extends Document {
  user: Types.ObjectId;
  fullName?: string;
  companyName?: string;
  bio?: string;
  avatarUrl?: string;
  settings: {
    theme: string;
    language: string;
    dashboardLayout: any[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<IProfile>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  fullName: { type: String },
  companyName: { type: String },
  bio: { type: String, maxlength: 500 },
  avatarUrl: { type: String },
  settings: { type: userSettingsSchema, default: () => ({}) }
}, { timestamps: true });

export const Profile = mongoose.model<IProfile>("Profile", profileSchema);
