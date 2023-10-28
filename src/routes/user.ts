import express from "express";

const router = express.Router();

import * as User from "../controllers/userCtrl";

router.post("/register", User.createUser);
router.post("/login", User.login);
router.get("/all-users", User.getallUser);
router.get("/:id", User.getUser);
router.delete("/:id", User.deleteUser);
router.patch("/:_id", User.updatedUser);

export default router;
