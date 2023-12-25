import { Document, Schema, Model, model } from "mongoose";

interface IProduct {
  product: {
    type: Schema.Types.ObjectId;
    ref: "Product";
  };
  count: number;
  color: string;
  price: number;
}

export interface ICart extends Document {
  products: IProduct[];
  cartTotal: number;
  totalAfterDiscount: number;
  orderedBy: any;
}

const cartSchema = new Schema(
  {
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        count: Number,
        color: String,
        price: Number,
      },
    ],
    cartTotal: Number,
    totalAfterDiscount: Number,
    orderedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Cart: Model<ICart> = model<ICart>("Cart", cartSchema);
