import express from "express";

const router = express.Router();

import * as Category from "../controllers/blogCategoryCtrl";
import { authMiddleware, isAdmin } from "../middlewares/auth";

router.post("/", authMiddleware, isAdmin, Category.createCategory);
router.put("/:id", authMiddleware, isAdmin, Category.updateCategory);
router.delete("/:id", authMiddleware, isAdmin, Category.deleteCategory);
router.get("/:id", Category.getCategory);
router.get("/", Category.getallCategory);

export default router;
