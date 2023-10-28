import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";

import { User } from "../models/userModel";

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const findUser = await User.findOne({ email: email });

  if (!findUser) {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } else {
    throw new Error("User Already Exists");
  }
});
