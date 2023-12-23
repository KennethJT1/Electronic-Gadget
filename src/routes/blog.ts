import express from "express";

const router = express.Router();

import * as Blog from "../controllers/blogCtrl";
import { authMiddleware, isAdmin } from "../middlewares/auth";
import { blogImgResize, uploadPhoto } from "../middlewares/uploadImage";

router.post("/", authMiddleware, isAdmin, Blog.createBlog);
router.put(
    "/upload/:id",
    authMiddleware,
    isAdmin,
    uploadPhoto.array("images", 2),
    blogImgResize,
    Blog.uploadImages
  );

router.patch("/likes", authMiddleware, Blog.liketheBlog);
router.patch("/dislikes", authMiddleware, Blog.disliketheBlog);

router.patch("/:id", authMiddleware, isAdmin, Blog.updateBlog);
router.get("/:id", Blog.getBlog);
router.get("/", Blog.getAllBlogs);
router.delete("/:id", authMiddleware, isAdmin, Blog.deleteBlog);



export default router;
