import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

import { Blog } from "../models/blogModel";
import { User } from "../models/userModel";
import { validateMongoDbId } from "../utils/validateMongodbId";
import asyncHandler from "express-async-handler";

export const createBlog = asyncHandler(async (req: Request, res: Response) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json(newBlog);
  } catch (error: any) {
    throw new Error(error.message);
  }
});

export const updateBlog = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateBlog);
  } catch (error: any) {
    throw new Error(error.message);
  }
});

export const getBlog = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getBlog = await Blog.findById(id)
      .populate("likes")
      .populate("dislikes");
    const updateViews = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );
    res.json(getBlog);
  } catch (error: any) {
    throw new Error(error.message);
  }
});

export const getAllBlogs = asyncHandler(async (req: Request, res: Response) => {
  try {
    const getBlogs = await Blog.find();
    res.json(getBlogs);
  } catch (error: any) {
    throw new Error(error.message);
  }
});

export const deleteBlog = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    res.json(deletedBlog);
  } catch (error: any) {
    throw new Error(error.message);
  }
});

export const liketheBlog = asyncHandler(
  async (req: JwtPayload, res: Response) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);

    const blog = await Blog.findById(blogId);

    const loginUserId = req?.user?.id;

    const alreadyDisliked = blog?.dislikes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    );

    if (alreadyDisliked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      );
      res.json(blog);
    }

    const isLiked = blog?.isLiked;
    if (isLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
     res.json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { likes: loginUserId },
          isLiked: true,
        },
        { new: true }
      );
      res.json(blog);
    }
  }
);

export const disliketheBlog = asyncHandler(
  async (req: JwtPayload, res: Response) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);

    const blog = await Blog.findById(blogId);

    const loginUserId = req?.user?.id;

    const alreadyLiked = blog?.likes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    );

    if (alreadyLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
      res.json(blog);
    }

    const isDisLiked = blog?.isDisliked;
    if (isDisLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      );
      res.json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { dislikes: loginUserId },
          isDisliked: true,
        },
        { new: true }
      );
      res.json(blog);
    }
  }
);

// export const uploadImages = asyncHandler(async (req: Request, res: Response) => {
//   const { id } = req.params;
//   validateMongoDbId(id);
//   try {
//     const uploader = (path) => cloudinaryUploadImg(path, "images");
//     const urls = [];
//     const files = req.files;
//     for (const file of files) {
//       const { path } = file;
//       const newpath = await uploader(path);
//       console.log(newpath);
//       urls.push(newpath);
//       fs.unlinkSync(path);
//     }
//     const findBlog = await Blog.findByIdAndUpdate(
//       id,
//       {
//         images: urls.map((file) => {
//           return file;
//         }),
//       },
//       {
//         new: true,
//       }
//     );
//     res.json(findBlog);
//   } catch (error) {
//     throw new Error(error);
//   }
// });
