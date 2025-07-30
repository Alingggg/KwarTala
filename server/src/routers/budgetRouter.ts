import express from "express";
import { budgetController } from "@/controllers/index";
import { authMiddleware } from "@/middlewares/index";

const router = express.Router();

router.put("/", authMiddleware, budgetController.updateBudget);

export default router;
