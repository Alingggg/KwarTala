import express from "express";
import { budgetController } from "@/controllers/index";
import { authMiddleware } from "@/middlewares/index";

const router = express.Router();

router.get("/", authMiddleware, budgetController.getBudget);
router.put("/", authMiddleware, budgetController.updateBudget);

export default router;
