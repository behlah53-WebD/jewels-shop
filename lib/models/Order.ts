import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem {
  product?: mongoose.Types.ObjectId | string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  material?: string;
}

export interface IShippingAddress {
  name: string;
  email?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface IInvoice {
  invoiceNumber: string;
  invoiceDate: Date;
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
  customerEmail: string;
  emailStatus: "pending" | "sent" | "failed";
}

export interface IReturnDetails {
  reason: string;
  comments?: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: Date;
  processedAt?: Date;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId | string;
  items: IOrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: IShippingAddress;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus: "processing" | "shipped" | "delivered" | "cancelled" | "return_requested" | "returned";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  returnDetails?: IReturnDetails;
  invoice?: IInvoice;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.Mixed, ref: "Product" },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, required: true },
  size: { type: String },
  material: { type: String },
});

const ShippingAddressSchema = new Schema<IShippingAddress>({
  name: { type: String, required: true },
  email: { type: String },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true, default: "India" },
  phone: { type: String, required: true },
});

const InvoiceSchema = new Schema<IInvoice>({
  invoiceNumber: { type: String, required: true },
  invoiceDate: { type: Date, default: Date.now },
  subtotal: { type: Number, required: true },
  taxAmount: { type: Number, default: 0 },
  shippingCost: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  customerEmail: { type: String, required: true },
  emailStatus: { type: String, enum: ["pending", "sent", "failed"], default: "pending" },
});

const ReturnDetailsSchema = new Schema<IReturnDetails>({
  reason: { type: String, required: true },
  comments: { type: String, default: "" },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  requestedAt: { type: Date, default: Date.now },
  processedAt: { type: Date },
});

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    shippingCost: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true, min: 0 },
    shippingAddress: { type: ShippingAddressSchema, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled", "return_requested", "returned"],
      default: "processing",
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    returnDetails: { type: ReturnDetailsSchema },
    invoice: { type: InvoiceSchema },
  },
  { timestamps: true }
);

OrderSchema.index({ user: 1, createdAt: -1 });

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

