import express from "express";

const router = express.Router();

import * as Product from "../controllers/productCtrl";
import { authMiddleware, isAdmin } from "../middlewares/auth";
import { productImgResize, uploadPhoto } from "../middlewares/uploadImage";

router.post("/", authMiddleware, isAdmin, Product.createProduct);
router.put(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  productImgResize,
  Product.uploadImages
);

router.put("/wishlist", authMiddleware, Product.addToWishlist);
router.put("/rating", authMiddleware, Product.rating);

router.patch("/:id", authMiddleware, isAdmin, Product.updateProduct);
router.delete("/:id", authMiddleware, isAdmin, Product.deleteProduct);
router.get("/:id", Product.getaProduct);

router.get("/", Product.getAllProduct);
export default router;
