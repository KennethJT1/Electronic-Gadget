import express from "express";

const router = express.Router();

import * as Blog from "../controllers/blogCtrl";
import { authMiddleware, isAdmin } from "../middlewares/auth";

router.post("/", authMiddleware, isAdmin, Blog.createBlog);
router.patch("/:id", authMiddleware, isAdmin, Blog.updateBlog);
router.get("/:id", Blog.getBlog);
router.get("/", Blog.getAllBlogs);

router.delete("/:id", authMiddleware, isAdmin, Blog.deleteBlog);

export default router;
