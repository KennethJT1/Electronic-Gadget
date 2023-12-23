import { Coupon } from "../models/couponModel";
import { Request, Response } from "express";

import { validateMongoDbId } from "../utils/validateMongodbId";
import asyncHandler from "express-async-handler";

export const createCoupon = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const newCoupon = await Coupon.create(req.body);
      res.json(newCoupon);
    } catch (error: any) {
      throw new Error(error);
    }
  }
);

export const getAllCoupons = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const coupons = await Coupon.find();
      res.json(coupons);
    } catch (error: any) {
      throw new Error(error);
    }
  }
);

export const updateCoupon = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    validateMongoDbId(id);

    try {
      const updatecoupon = await Coupon.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.json(updatecoupon);
    } catch (error: any) {
      throw new Error(error);
    }
  }
);

export const deleteCoupon = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const deletecoupon = await Coupon.findByIdAndDelete(id);
      res.json(deletecoupon);
    } catch (error: any) {
      throw new Error(error);
    }
  }
);

export const getCoupon = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  validateMongoDbId(id);

  try {
    const getAcoupon = await Coupon.findById(id);
    
    res.json(getAcoupon);
  } catch (error: any) {
    throw new Error(error);
  }
});
