import express from "express";

const router = express.Router();

import * as User from "../controllers/userCtrl";
import { authMiddleware, isAdmin } from "../middlewares/auth";

router.post("/register", User.createUser);
router.post("/login", User.login);
router.post("/admin-login", User.adminLogin);
router.post("/cart", authMiddleware, User.userCart);
router.post("/cart/applycoupon", authMiddleware, User.applyCoupon);
router.post("/cart/cash-order", authMiddleware, User.createOrder);
router.get("/get-orders", authMiddleware, User.getOrders);
router.get("/getallorders", authMiddleware, isAdmin, User.getAllOrders);
router.post("/getorderbyuser/:id", authMiddleware, isAdmin, User.getAllOrders);

router.get("/all-users", User.getallUser);
router.get("/cart", authMiddleware, User.getUserCart);

router.get("/wishlist", authMiddleware, User.getWishlist);
router.get("/:id", authMiddleware, isAdmin, User.getUser);
router.delete("/empty-cart", authMiddleware, User.emptyCart);
router.delete("/:id", User.deleteUser);
router.put(
    "/order/update-order/:id",
    authMiddleware,
    isAdmin,
    User.updateOrderStatus
  );
router.patch("/edit-user", authMiddleware, User.updatedUser);
router.patch("/address", authMiddleware, User.saveAddress);

router.put("/block-user/:id", authMiddleware, isAdmin, User.blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, User.unBlockUser);
router.get("/refresh", User.handleRefreshToken);

router.put("/password", authMiddleware, User.updatePassword);
router.post("/forgot-password-token", User.forgotPasswordToken);
router.put("/reset-password/:token", User.resetPassword);

export default router;
