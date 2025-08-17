import express from "express";
import { authController } from "@/controllers/index";
import {
  authMiddleware,
  loginLimiter,
  passwordResetRateLimit,
  registerLimiter,
} from "@/middlewares/index";
import { emailVerificationRateLimit } from "@/middlewares/index";

const router = express.Router();

router.post("/register", registerLimiter, authController.register);
router.post("/login", loginLimiter, authController.login);
router.post("/logout", authController.logout);
router.post("/refresh-token", authController.refreshAccessToken);
router.get("/me", authMiddleware, authController.getCurrentUser);
router.post(
  "/verify-email",
  emailVerificationRateLimit,
  authController.verifyEmail
);
router.post(
  "/verification-email",
  emailVerificationRateLimit,
  authController.sendVerificationEmail
);
router.post("/change-username", authMiddleware, authController.updateUserName);
router.post(
  "/reset-password",
  passwordResetRateLimit,
  authController.resetPassword
);
router.post(
  "/has-to-re-login",
  authMiddleware,
  authController.checkHasToReLogIn
);

export default router;
