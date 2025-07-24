import express from "express";
import { expenseController } from "#controllers";
import { authMiddleware } from "#middlewares";

const router = express.Router();

router.post("/", authMiddleware, expenseController.createExpense);
router.put("/:id", authMiddleware, expenseController.updateExpense);
router.delete("/:id", authMiddleware, expenseController.deleteExpense);

export default router;
