import express from "express";

const router = express.Router();

import * as Coupon from "../controllers/couponCtrl";

import { authMiddleware, isAdmin } from "../middlewares/auth";

router.post("/", authMiddleware, isAdmin, Coupon.createCoupon);
router.get("/:id", authMiddleware, isAdmin, Coupon.getAllCoupons);
router.put("/:id", authMiddleware, isAdmin, Coupon.updateCoupon);
router.delete("/:id", authMiddleware, isAdmin, Coupon.deleteCoupon);

router.get("/", authMiddleware, isAdmin, Coupon.getAllCoupons);

export default router;
