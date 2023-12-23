import { model, Schema, Document, Model } from "mongoose";

interface IRating {
  star: number;
  postedby: string;
}


export interface IProduct extends Document {
  title: string;
  slug: string;
  description: string;
  price: number;
  category: any;
  quantity: number;
  sold: number;
  images: [];
  color: string;
  ratings: IRating[];
  brand: string;
  totalrating: number;
}

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    images: [],
    color: {
      type: String,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    brand: {
      type: String,
      required: true,
    },
    ratings: [
      {
        star: Number,
        postedby: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
    totalrating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Product: Model<IProduct> = model<IProduct>(
  "Product",
  productSchema
);
