import { model, Schema, Document, Model } from "mongoose";

export interface ICoupon extends Document {
  name: string;
  expiry: Date;
  discount: number;
}

const couponSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
});

export const Coupon: Model<ICoupon> = model<ICoupon>("Coupon", couponSchema);
