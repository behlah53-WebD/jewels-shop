import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const ProfileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  addresses: z
    .array(
      z.object({
        _id: z.string().optional(),
        name: z.string().optional(),
        street: z.string().min(1, "Street address is required"),
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        postalCode: z.string().min(1, "Postal code is required"),
        country: z.string().default("India"),
        phone: z.string().optional(),
        isDefault: z.boolean().optional(),
      })
    )
    .optional(),
});

export const ProductSchemaValidation = z.object({
  name: z.string().min(2, "Product name is required"),
  slug: z.string().nullish().or(z.literal("")),
  description: z.string().min(5, "Description is required"),
  shortDescription: z.string().nullish().or(z.literal("")),
  price: z.number().min(0, "Price must be non-negative"),
  compareAtPrice: z.number().min(0).nullish().or(z.literal("")),
  category: z.string().min(1, "Category is required"),
  material: z.string().optional().default("18K Gold"),
  collectionName: z.string().nullish().or(z.literal("")),
  images: z.array(z.string().min(1, "Image entry cannot be empty")).default([]),
  featuredImage: z.string().min(1, "Featured image is required"),
  stock: z.number().min(0, "Stock cannot be negative"),
  SKU: z.string().min(1, "SKU is required"),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  specifications: z
    .array(
      z.object({
        key: z.string(),
        value: z.string(),
      })
    )
    .optional(),
});

export const CategorySchemaValidation = z.object({
  name: z.string().min(2, "Category name is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  active: z.boolean().default(true),
});

export const OrderCreateSchema = z.object({
  items: z
    .array(
      z.object({
        product: z.string().optional(),
        name: z.string().min(1, "Item name is required"),
        price: z.number().min(0),
        quantity: z.number().min(1),
        image: z.string(),
        size: z.string().optional(),
        material: z.string().optional(),
      })
    )
    .min(1, "Order must contain at least one item"),
  shippingAddress: z.object({
    name: z.string().min(1, "Recipient name is required"),
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().default("India"),
    phone: z.string().min(1, "Phone number is required"),
  }),
});

export const OrderStatusUpdateSchema = z.object({
  orderStatus: z.enum(["processing", "shipped", "delivered", "cancelled"]).optional(),
  paymentStatus: z.enum(["pending", "paid", "failed"]).optional(),
});
