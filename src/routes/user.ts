import express from "express";

const router = express.Router();

import * as User from "../controllers/userCtrl";

router.post("/register", User.createUser);

export default router;
