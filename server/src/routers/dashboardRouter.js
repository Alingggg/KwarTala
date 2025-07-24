import express from "express";
import { dashboardController } from "#controllers";
import { authMiddleware } from "#middlewares";

const router = express.Router();

router.get("/home", authMiddleware, dashboardController.getHomeData);

export default router;
