import { model, Schema, Document, Model } from "mongoose";

export interface IBrand extends Document {
  title: string;
}

const brandSchema = new Schema<IBrand>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Brand: Model<IBrand> = model<IBrand>(
  "Brand",
  brandSchema
);
