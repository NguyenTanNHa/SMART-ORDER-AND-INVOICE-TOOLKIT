import mongoose, { Document, Schema, Types } from "mongoose";

export interface IProduct extends Document {
  user: Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  stockCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stockCount: { type: Number, default: 0 }
}, { timestamps: true });

export const Product = mongoose.model<IProduct>("Product", productSchema);
