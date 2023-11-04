import { model, Schema, Types, Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  mobile: string;
  role: string;
  isBlocked: boolean;
  cart: any;
  address: string;
  wishlist: [{}];

  isPasswordMatched: (enteredPassword: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  firstname: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  lastname: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    default: "user",
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  cart: {
    type: Array,
    default: [],
  },
  address: {
    type: String,
  },
  wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.isPasswordMatched = async function (enteredPassword: any) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.isPasswordMatched = async function (
  enteredPassword: string
) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createPasswordResetToken = async function () {
  const resettoken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 minutes
  return resettoken;
};

export const User: Model<IUser> = model<IUser>("User", userSchema);
