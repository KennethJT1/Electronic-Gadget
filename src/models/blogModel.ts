import { model, Schema, Document, Model } from "mongoose";

export interface IBlog extends Document {
  title: string;
  description: string;
  category: string;
  numViews: number;
  author: string;
  isLiked: boolean;
  isDisliked: boolean;
  images: {};
  likes: [{}];
  dislikes: [{}];
}

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    numViews: {
      type: Number,
      default: 0,
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    isDisliked: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    author: {
      type: String,
      default: "Admin",
    },
    images: {
      type: String,
      default:
        "https://media.istockphoto.com/id/887987150/photo/blogging-woman-reading-blog.jpg?s=612x612&w=0&k=20&c=7SScR_Y4n7U3k5kBviYm3VwEmW4vmbngDUa0we429GA=",
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

export const Blog: Model<IBlog> = model<IBlog>("Blog", blogSchema);
