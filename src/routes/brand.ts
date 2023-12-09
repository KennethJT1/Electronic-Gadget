import express from "express";

const router = express.Router();

import * as Brand from "../controllers/brandCtrl";
import { authMiddleware, isAdmin } from "../middlewares/auth";

router.post("/", authMiddleware, isAdmin, Brand.createBrand);
router.put("/:id", authMiddleware, isAdmin, Brand.updateBrand);
router.delete("/:id", authMiddleware, isAdmin, Brand.deleteBrand);
router.get("/:id", Brand.getBrand);
router.get("/", Brand.getallBrand);

export default router;
