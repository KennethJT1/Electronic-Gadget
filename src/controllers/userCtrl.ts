import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import jwt, { JwtPayload } from "jsonwebtoken";

import { User } from "../models/userModel";
import { generateToken } from "../config/jwtToken";
import { generateRefreshToken } from "../config/refreshtoken";
import { validateMongoDbId } from "../utils/validateMongodbId";

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
