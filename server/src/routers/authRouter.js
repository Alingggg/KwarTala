import express from "express";
import { authController } from "#controllers";
import { authMiddleware } from "#middlewares";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh-token", authController.refreshAccessToken);
router.get("/me", authMiddleware, authController.getCurrentUser);

export default router;
