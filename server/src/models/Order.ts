import mongoose, { Document, Schema, Types } from "mongoose";

export interface IOrderItem {
  productName: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  customerName: string;
  customerEmail?: string;
  phone?: string;
  items: IOrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  invoiceId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
}, { _id: false });

const orderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String },
  phone: { type: String },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered'], default: 'Pending' },
  invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice' }
}, { timestamps: true });

export const Order = mongoose.model<IOrder>("Order", orderSchema);
