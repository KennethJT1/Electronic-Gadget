import express from "express";

const router = express.Router();

import * as Product from "../controllers/productCtrl";
import { authMiddleware, isAdmin } from "../middlewares/auth";

router.post("/", authMiddleware, isAdmin, Product.createProduct);
router.put("/wishlist", authMiddleware, Product.addToWishlist);
router.put("/rating", authMiddleware,Product.rating);

router.patch("/:id", authMiddleware, isAdmin, Product.updateProduct);
router.delete("/:id", authMiddleware, isAdmin, Product.deleteProduct);
router.get("/:id", Product.getaProduct);

router.get("/", Product.getAllProduct);
export default router;
