import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import slugify from "slugify";

import { Product } from "../models/productModel";
import { validateMongoDbId } from "../utils/validateMongodbId";

export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      if (req.body.title) {
        req.body.slug = slugify(req.body.title);
      }
      const newProduct = await Product.create(req.body);
      res.json(newProduct);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params;
    validateMongoDbId(id);
    try {
      if (req.body.title) {
        req.body.slug = slugify(req.body.title);
      }
      const updateProduct = await Product.findOneAndUpdate({ id }, req.body, {
        new: true,
      });
      res.json(updateProduct);
    } catch (error:any) {
      throw new Error(error.message);
    }
  });
  
  export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params;
    validateMongoDbId(id);
    try {
      const deleteProduct = await Product.findOneAndDelete(id);
      res.json(deleteProduct);
    } catch (error:any) {
      throw new Error(error.message);
    }
  });
  
  export const getaProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const findProduct = await Product.findById(id);
      res.json(findProduct);
    } catch (error:any) {
      throw new Error(error.message);
    }
  });
  
//   const getAllProduct = asyncHandler(async (req: Request, res: Response) => {
//     try {
//       // Filtering
//       const queryObj = { ...req.query };
//       const excludeFields = ["page", "sort", "limit", "fields"];
//       excludeFields.forEach((el) => delete queryObj[el]);
//       let queryStr = JSON.stringify(queryObj);
//       queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  
//       let query = Product.find(JSON.parse(queryStr));
  
//       // Sorting
  
//       if (req.query.sort) {
//         const sortBy = req.query.sort.split(",").join(" ");
//         query = query.sort(sortBy);
//       } else {
//         query = query.sort("-createdAt");
//       }
  
//       // limiting the fields
  
//       if (req.query.fields) {
//         const fields = req.query.fields.split(",").join(" ");
//         query = query.select(fields);
//       } else {
//         query = query.select("-__v");
//       }
  
//       // pagination
  
//       const page = req.query.page as any;
//       const limit = req.query.limit as any;
//       const skip = (page - 1) * limit;
//       query = query.skip(skip).limit(limit);
//       if (req.query.page) {
//         const productCount = await Product.countDocuments();
//         if (skip >= productCount) throw new Error("This Page does not exists");
//       }
//       const product = await query;
//       res.json(product);
//     } catch (error:any) {
//       throw new Error(error.message);
//     }
//   });