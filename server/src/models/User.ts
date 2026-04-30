import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  created_at: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

export const User = mongoose.model<IUser>("User", userSchema);
