import express from "express";
import { budgetController } from "#controllers";
import { authMiddleware } from "#middlewares";

const router = express.Router();

router.put("/", authMiddleware, budgetController.updateBudget);

export default router;
