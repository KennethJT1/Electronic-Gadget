import { Request, Response } from "express";

import { Brand } from "../models/brandModel";
import { validateMongoDbId } from "../utils/validateMongodbId";
import asyncHandler from "express-async-handler";

export const createBrand = asyncHandler(async (req: Request, res: Response) => {
  try {
    const newBrand = await Brand.create(req.body);
    res.json(newBrand);
  } catch (error: any) {
    throw new Error(error.message);
  }
});

export const updateBrand = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedBrand);
  } catch (error: any) {
    throw new Error(error.message);
  }
});

export const deleteBrand = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedBrand = await Brand.findByIdAndDelete(id);
    res.json(deletedBrand);
  } catch (error: any) {
    throw new Error(error.message);
  }
});

export const getBrand = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaBrand = await Brand.findById(id);
    res.json(getaBrand);
  } catch (error: any) {
    throw new Error(error.message);
  }
});

export const getallBrand = asyncHandler(async (req: Request, res: Response) => {
  try {
    const getallBrand = await Brand.find();
    res.json(getallBrand);
  } catch (error: any) {
    throw new Error(error.message);
  }
});
