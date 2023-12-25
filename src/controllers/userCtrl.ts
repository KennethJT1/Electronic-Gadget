import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt, { JwtPayload } from "jsonwebtoken";
import crypto from "crypto";
import uniqid from "uniqid";

import { User } from "../models/userModel";
import { generateToken } from "../config/jwtToken";
import { generateRefreshToken } from "../config/refreshtoken";
import { validateMongoDbId } from "../utils/validateMongodbId";
import { sendEmail } from "./emailCtrl";
import { Product } from "../models/productModel";
import { Cart } from "../models/cartModel";
import { Coupon } from "../models/couponModel";
import { Order } from "../models/orderModel";

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const findUser = await User.findOne({ email });

  if (!findUser) {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } else {
    throw new Error("User Already Exists");
  }
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const findUser = await User.findOne({ email }).select("+password");

  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updatedUser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    findUser!.password = undefined as any;

    res.status(201).json({
      user: findUser,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const findUser = await User.findOne({ email }).select("+password");

  if (findUser!.role !== "admin") {
    throw new Error("Not Authorized");
  }

  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updatedUser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    findUser!.password = undefined as any;

    res.status(201).json({
      user: findUser,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

export const logout = asyncHandler(async (req: Request, res: any) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204);
});

export const getallUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const getUsers = await User.find();
    // .populate("wishlist");
    res.status(200).json({ count: getUsers.length, users: getUsers });
  } catch (error: any) {
    throw new Error(error.message);
  }
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const getaUser = await User.findById(id);
    res.status(200).json({
      getaUser,
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    await User.findByIdAndDelete(id);
    res.status(204).json("User deleted successfully");
  } catch (error: any) {
    throw new Error(error.message);
  }
});

export const updatedUser = asyncHandler(
  async (req: JwtPayload, res: Response) => {
    const { id } = req.user;
    validateMongoDbId(id);

    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          firstname: req?.body?.firstname,
          lastname: req?.body?.lastname,
          email: req?.body?.email,
          mobile: req?.body?.mobile,
        },
        {
          new: true,
        }
      );
      res.status(201).json(updatedUser);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const blockUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const blockusr = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.status(201).json({ msg: "User has been blocked successfully" });
  } catch (error: any) {
    throw new Error(error.message);
  }
});

export const unBlockUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const unBlocked = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.status(201).json({
      msg: "User has been unblocked successfully",
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
});

export const handleRefreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user)
      throw new Error(" No Refresh token present in db or not matched");
    jwt.verify(
      refreshToken,
      process.env.JWT_SECRET!,
      (err: any, decoded: any) => {
        if (err || user.id !== decoded.id) {
          throw new Error("There is something wrong with refresh token");
        }
        const accessToken = generateToken(user?._id);
        res.json({ token: accessToken });
      }
    );
  }
);

export const updatePassword = asyncHandler(
  async (req: JwtPayload, res: Response) => {
    const { id } = req.user;
    const { password } = req.body;
    validateMongoDbId(id);
    const user = await User.findById(id);
    if (password) {
      user!.password = password;
      const updatedPassword = await user!.save();
      res.json(updatedPassword);
    } else {
      res.json(user);
    }
  }
);

export const forgotPasswordToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found with this email");
    try {
      const token = await user.createPasswordResetToken();
      await user.save();
      const resetURL = `${req.protocol}://${req.get(
        "host"
      )}/api/user/reset-password/${token}`;
      const message = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. Click Here \n\n ${resetURL}`;
      const data = {
        to: email,
        subject: "Forgot Password Link",
        html: message,
      };

      sendEmail(data);

      res.json(token);
    } catch (error: any) {
      throw new Error(error);
    }
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error(" Token Expired, Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
  }
);

export const getWishlist = asyncHandler(
  async (req: JwtPayload, res: Response) => {
    const { id } = req.user;
    try {
      const findUser = await User.findById(id).populate("wishlist");
      res.json(findUser);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const saveAddress = asyncHandler(
  async (req: JwtPayload, res: Response) => {
    const { id } = req.user;
    validateMongoDbId(id);
    try {
      const user = await User.findByIdAndUpdate(
        id,
        {
          address: req.body?.address,
        },
        {
          new: true,
        }
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const userCart = asyncHandler(
  async (req: JwtPayload, res: Response, next: NextFunction) => {
    const { id } = req.user;
    validateMongoDbId(id);

    const { cart } = req.body;
    try {
      let products = [];

      const user = await User.findById(id);

      const existingCart = await Cart.findOne({ orderBy: user!._id });
      if (existingCart) {
        existingCart.deleteOne();
      }

      for (let i = 0; i < cart.length; i++) {
        let object = {
          product: cart[i]._id,
          count: cart[i].count,
          color: "",
          price: 0,
        };

        let getPrice = await Product.findById(cart[i]._id)
          .select("price color")
          .exec();

        object.color = getPrice!.color;
        object.price = getPrice!.price;
        products.push(object);
      }
      let cartTotal = 0;
      for (let i = 0; i < products.length; i++) {
        cartTotal += products[i].price * products[i].count;
      }
      let newCart = await new Cart({
        products,
        cartTotal,
        orderedBy: user?._id,
      }).save();
      res.json(newCart);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const getUserCart = asyncHandler(
  async (req: JwtPayload, res: Response) => {
    const { id } = req.user;
    validateMongoDbId(id);
    try {
      const cart = await Cart.findOne({ orderby: id }).populate(
        "products.product"
      );
      res.json(cart);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const emptyCart = asyncHandler(
  async (req: JwtPayload, res: Response) => {
    const { id } = req.user;
    validateMongoDbId(id);
    try {
      const user = await User.findOne({ id });
      const cart = await Cart.findOneAndRemove({ orderby: user!._id });
      res.json(cart);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const applyCoupon = asyncHandler(
  async (req: JwtPayload, res: Response) => {
    const { id } = req.user;
    validateMongoDbId(id);

    const { coupon } = req.body;
    try {
      const validCoupon = await Coupon.findOne({ name: coupon });
      if (validCoupon === null) {
        throw new Error("Invalid Coupon");
      }

      const user = await User.findOne({ _id: id });

      const cart = await Cart.findOne({
        orderedBy: user!._id,
      }).populate("products.product");

      if (!cart) {
        throw new Error("Cart not found");
      }

      let { cartTotal } = cart;
      let totalAfterDiscount = (
        parseFloat(cartTotal.toString()) -
        (parseFloat(cartTotal.toString()) * validCoupon.discount) / 100
      ).toFixed(2);

      await Cart.findOneAndUpdate(
        { orderedBy: user!._id },
        { totalAfterDiscount },
        { new: true }
      );

      res.json(totalAfterDiscount);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const createOrder = asyncHandler(
  async (req: JwtPayload, res: Response) => {
    const { id } = req.user;
    validateMongoDbId(id);

    const { COD, couponApplied } = req.body;

    try {
      if (!COD) throw new Error("Create cash order failed");
      const user = await User.findById(id);

      let userCart = await Cart.findOne({ orderedBy: user!._id });

      let finalAmount = 0;
      if (couponApplied && userCart!.totalAfterDiscount) {
        finalAmount = userCart!.totalAfterDiscount as number;
      } else {
        finalAmount = userCart!.cartTotal as number;
      }

      await new Order({
        products: userCart!.products,
        paymentIntent: {
          id: uniqid(),
          method: "COD",
          amount: finalAmount,
          status: "Cash on Delivery",
          created: Date.now(),
          currency: "usd",
        },
        orderedBy: user!._id,
        orderStatus: "Cash on Delivery",
      }).save();

      let update = userCart!.products.map((item: any) => {
        return {
          updateOne: {
            filter: { _id: item.product._id },
            update: { $inc: { quantity: -item.count, sold: +item.count } },
          },
        };
      });

      await Product.bulkWrite(update, {});
      res.json({ message: "success" });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const getOrders = asyncHandler(
  async (req: JwtPayload, res: Response) => {
    const { id } = req.user;
    validateMongoDbId(id);
    try {
      const userorders = await Order.findOne({ orderby: id })
        .populate("products.product")
        .populate("orderby")
        .exec();
      res.json(userorders);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const getAllOrders = asyncHandler(
  async (req: JwtPayload, res: Response) => {
    try {
      const alluserorders = await Order.find()
        .populate("products.product")
        .populate("orderby")
        .exec();
      res.json(alluserorders);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const getOrderByUserId = asyncHandler(
  async (req: JwtPayload, res: Response) => {
    const { id } = req.user;
    validateMongoDbId(id);
    try {
      const userorders = await Order.findOne({ orderby: id })
        .populate("products.product")
        .populate("orderby")
        .exec();
      res.json(userorders);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const updateOrderStatus = asyncHandler(
  async (req: JwtPayload, res: Response) => {
    const { id } = req.user;
    validateMongoDbId(id);

    const { status } = req.body;

    try {
      const updateOrderStatus = await Order.findByIdAndUpdate(
        id,
        {
          orderStatus: status,
          paymentIntent: {
            status: status,
          },
        },
        { new: true }
      );
      res.json(updateOrderStatus);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);
