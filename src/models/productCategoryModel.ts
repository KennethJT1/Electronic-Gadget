import { model, Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
  title: string;
}

const productCategorySchema = new Schema<ICategory>(
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

export const ProductCategory: Model<ICategory> = model<ICategory>(
  "ProductCategory",
  productCategorySchema
);
