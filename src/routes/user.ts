import express from "express";

const router = express.Router();

import * as User from "../controllers/userCtrl";
import { authMiddleware, isAdmin } from "../middlewares/auth";

router.post("/register", User.createUser);
router.post("/login", User.login);
router.get("/all-users", User.getallUser);
router.get("/:id", authMiddleware, isAdmin, User.getUser);
router.delete("/:id", User.deleteUser);
router.patch("/edit-user", authMiddleware, User.updatedUser);

router.put("/block-user/:id", authMiddleware, isAdmin, User.blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, User.unBlockUser);
router.get("/refresh", User.handleRefreshToken);


router.put("/password", authMiddleware, User.updatePassword);
router.post("/forgot-password-token", User.forgotPasswordToken);
router.put("/reset-password/:token", User.resetPassword);

export default router;
