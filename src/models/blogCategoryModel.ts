import { model, Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
  title: string;
}

const blogCategorySchema = new Schema<ICategory>(
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

export const BlogCategory: Model<ICategory> = model<ICategory>(
  "BlogCategory",
  blogCategorySchema
);
