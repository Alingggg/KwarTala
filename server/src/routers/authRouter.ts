import express from "express";
import { authController } from "@/controllers/index";
import { authMiddleware } from "@/middlewares/index";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh-token", authController.refreshAccessToken);
router.get("/me", authMiddleware, authController.getCurrentUser);
router.post("/verify-email", authController.verifyEmail);
router.post("/verification-email", authController.sendVerificationEmail);
router.post("/change-username", authMiddleware, authController.updateUserName);
router.post("/reset-password", authController.resetPassword);

export default router;
