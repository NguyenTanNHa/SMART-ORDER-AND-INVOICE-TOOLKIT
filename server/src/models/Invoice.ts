import mongoose, { Document, Schema, Types } from "mongoose";

export interface IInvoice extends Document {
  user: Types.ObjectId;
  orderId: Types.ObjectId;
  invoiceNumber: string;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
  dueDate?: Date;
  notes?: string;
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const invoiceSchema = new Schema<IInvoice>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  invoiceNumber: { type: String, required: true, unique: true },
  status: { type: String, enum: ['Draft', 'Sent', 'Paid', 'Overdue'], default: 'Draft' },
  dueDate: { type: Date },
  notes: { type: String },
  pdfUrl: { type: String }
}, { timestamps: true });

export const Invoice = mongoose.model<IInvoice>("Invoice", invoiceSchema);
