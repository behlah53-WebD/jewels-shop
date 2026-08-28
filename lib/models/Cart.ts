import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICartItem {
  product: mongoose.Types.ObjectId | string;
  quantity: number;
  size?: string;
  image?: string;
  name?: string;
  price?: number;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId | string;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  product: { type: Schema.Types.Mixed, ref: "Product", required: true },
  quantity: { type: Number, required: true, default: 1, min: 1 },
  size: { type: String, default: "" },
  image: { type: String, default: "" },
  name: { type: String, default: "" },
  price: { type: Number, default: 0 },
});

const CartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

export const Cart: Model<ICart> =
  mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);
