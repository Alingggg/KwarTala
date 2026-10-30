import express from "express";
import { chatController } from "@/controllers/index";
import { authMiddleware, chatLimiter } from "@/middlewares/index";

const router = express.Router();

router.post("/", authMiddleware, chatLimiter, chatController.sendMessage);
router.delete("/", authMiddleware, chatController.clearChat);

export default router;
