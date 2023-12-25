import { Request, Response } from "express";
import { ProductCategory } from "../models/productCategoryModel";
import { validateMongoDbId } from "../utils/validateMongodbId";
import asyncHandler from "express-async-handler";

export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const category = await ProductCategory.create(req.body);
      res.json(category);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const updatedCategory = await ProductCategory.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
        }
      );
      res.json(updatedCategory);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const deletedCategory = await ProductCategory.findByIdAndDelete(id);
      res.json(deletedCategory);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const getCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaCategory = await ProductCategory.findById(id);
    res.json(getaCategory);
  } catch (error: any) {
    throw new Error(error.message);
  }
});

export const getallCategory = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const getallCategory = await ProductCategory.find();
      res.json(getallCategory);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);
