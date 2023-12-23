import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import slugify from "slugify";
import fs from "fs";
import { Product } from "../models/productModel";
import { validateMongoDbId } from "../utils/validateMongodbId";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../models/userModel";
import { cloudinaryUploadImg } from "../utils/cloudinary";

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

export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
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
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params;
    validateMongoDbId(id);
    try {
      const deleteProduct = await Product.findOneAndDelete(id);
      res.json(deleteProduct);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const getaProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const findProduct = await Product.findById(id);
    res.json(findProduct);
  } catch (error: any) {
    throw new Error(error.message);
  }
});

export const getAllProduct = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      // Filtering
      const queryObj = { ...req.query };
      const excludeFields = ["page", "sort", "limit", "fields"];
      excludeFields.forEach((el) => delete queryObj[el]);
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      );

      let query = Product.find(JSON.parse(queryStr));

      // Sorting
      if (req.query.sort) {
        const sortBy = (req.query.sort as string).split(",").join(" ");
        query = query.sort(sortBy);
      } else {
        query = query.sort("-createdAt");
      }

      // limiting the fields
      if (req.query.fields) {
        const fields = (req.query.fields as string).split(",").join(" ");
        query = query.select(fields);
      } else {
        query = query.select("-__v");
      }

      // pagination
      const page = req.query.page as any;
      const limit = req.query.limit as any;
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);
      if (req.query.page) {
        const productCount = await Product.countDocuments();
        if (skip >= productCount) throw new Error("This Page does not exist");
      }
      const product = await query;
      res.json({ Count: product.length, Products: product });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const addToWishlist = asyncHandler(
  async (req: JwtPayload, res: Response) => {
    const { id } = req.user;
    const { prodId } = req.body;
    console.log(prodId);
    try {
      const user = await User.findById(id);
      const alreadyadded = user?.wishlist.find(
        (id) => id.toString() === prodId
      );
      if (alreadyadded) {
        let user = await User.findByIdAndUpdate(
          id,
          {
            $pull: { wishlist: prodId },
          },
          {
            new: true,
          }
        );
        res.json(user);
      } else {
        let user = await User.findByIdAndUpdate(
          id,
          {
            $push: { wishlist: prodId },
          },
          {
            new: true,
          }
        );
        res.json(user);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const rating = asyncHandler(async (req: JwtPayload, res: Response) => {
  const { id } = req.user;
  const { star, prodId, comment } = req.body;

  try {
    const product = await Product.findById(prodId);

    let alreadyRated = product?.ratings.find(
      (userId) => userId.postedby.toString() === id.toString()
    );
    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      );
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: id,
            },
          },
        },
        {
          new: true,
        }
      );
    }
    const getallratings = await Product.findById(prodId);
    let totalRating = getallratings!.ratings.length;
    let ratingsum = getallratings!.ratings
      .map((item: any) => item.star)
      .reduce((prev: any, curr: any) => prev + curr, 0);
    let actualRating = Math.round(ratingsum / totalRating);
    let finalproduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      { new: true }
    );
    res.json(finalproduct);
  } catch (error: any) {
    throw new Error(error.message);
  }
});

export const uploadImages = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);

    const uploader = (path: any) => cloudinaryUploadImg(path);
    const urls: any = [];

    const files: any = req.files;

    for (const file of files) {
      const { path } = file;
      try {
        const newPath: any = await uploader(path);
        urls.push(newPath);
        fs.unlinkSync(path);
      } catch (uploadError: any) {
        if (uploadError.message === "File not found") {
          res.status(400).json({ status: "fail", message: "File not found" });
        } else if (
          uploadError.message ===
          "Cloudinary upload response is not as expected"
        ) {
          res.status(500).json({
            status: "error",
            message: "Unexpected Cloudinary response",
          });
        } else {
          res
            .status(500)
            .json({ status: "error", message: "Internal Server Error" });
        }
      }
    }

    const findProduct = await Product.findByIdAndUpdate(
      id,
      {
        images: urls.map((file: any) => {
          return file;
        }),
      },
      {
        new: true,
      }
    );

    if (!findProduct) {
      return res
        .status(404)
        .json({ status: "fail", message: "Product not found" });
    }

    res.json(findProduct);
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
