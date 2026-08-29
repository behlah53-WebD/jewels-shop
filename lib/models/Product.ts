import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISpecification {
  key: string;
  value: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  category: mongoose.Types.ObjectId | string;
  material: string;
  collectionName?: string;
  images: string[];
  featuredImage: string;
  stock: number;
  SKU: string;
  tags: string[];
  featured: boolean;
  active: boolean;
  specifications: ISpecification[];
  createdAt: Date;
  updatedAt: Date;
}

const SpecificationSchema = new Schema<ISpecification>({
  key: { type: String, required: true },
  value: { type: String, required: true },
});

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    category: { type: Schema.Types.Mixed, ref: "Category", required: true },
    material: { type: String, default: "18K Gold" },
    collectionName: { type: String, default: "" },
    images: [{ type: String }],
    featuredImage: { type: String, required: true },
    stock: { type: Number, required: true, default: 10, min: 0 },
    SKU: { type: String, required: true, unique: true, trim: true },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    specifications: [SpecificationSchema],
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text", material: "text", SKU: "text" });
ProductSchema.index({ category: 1, active: 1 });
ProductSchema.index({ featured: 1, active: 1 });
ProductSchema.index({ material: 1 });
ProductSchema.index({ collectionName: 1 });
ProductSchema.index({ createdAt: -1 });

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
