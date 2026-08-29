import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOtp extends Document {
  email: string;
  otp: string;
  purpose: "registration" | "forgot_password";
  attempts: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OtpSchema = new Schema<IOtp>(
  {
    email: { type: String, required: true, lowercase: true, index: true },
    otp: { type: String, required: true },
    purpose: { type: String, required: true, enum: ["registration", "forgot_password"] },
    attempts: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true, expires: 0 }, // MongoDB TTL index
  },
  { timestamps: true }
);

OtpSchema.index({ email: 1, purpose: 1 });

export const Otp: Model<IOtp> =
  mongoose.models.Otp || mongoose.model<IOtp>("Otp", OtpSchema);
