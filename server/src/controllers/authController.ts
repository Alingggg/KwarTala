import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  userNameSchema,
  verificationEmailSchema,
  verifyEmailSchema,
} from "@/schemas/index";
import { sessionService, userService } from "@/services/index";
import type { CustomError } from "@/types/index";
import type { NextFunction, Request, Response } from "express";

const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validationResult = registerSchema.safeParse(req.body);
      if (!validationResult.success) {
        const error: CustomError = new Error();
        error.statusCode = 400;
        error.message = validationResult.error.issues[0].message;
        throw error;
      }

      const { userName, email, password } = validationResult.data;

      const existingUser = await userService.getUserByEmail(email);
      if (existingUser) {
        const error: CustomError = new Error("User already exists");
        error.statusCode = 409;
        throw error;
      }

      const newUser = await userService.registerUser({
        userName,
        email,
        password,
      });
      if (!newUser) {
        const error: CustomError = new Error("User registration failed");
        error.statusCode = 500;
        throw error;
      }

      res
        .status(201)
        .json({ data: newUser, message: "User registered successfully" });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const hasAccessToken = req.cookies.accessToken;
      const hasRefreshToken = req.cookies.refreshToken;
      if (hasAccessToken || hasRefreshToken) {
        const error: CustomError = new Error("Already logged in");
        error.statusCode = 409;
        throw error;
      }

      const validationResult = loginSchema.safeParse(req.body);
      if (!validationResult.success) {
        const error: CustomError = new Error();
        error.statusCode = 400;
        error.message = validationResult.error.issues[0].message;
        throw error;
      }

      const { email, password } = validationResult.data;

      const { user, accessToken, refreshToken } = await userService.loginUser({
        email,
        password,
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.status(200).json({ data: user, message: "Login successful" });
    } catch (error) {
      next(error);
    }
  },

  async refreshAccessToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        const error: CustomError = new Error("Refresh token is required");
        error.statusCode = 401;
        throw error;
      }

      const newAccessToken = await userService.refreshAccessToken(refreshToken);

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.status(200).json({ message: "Access token refreshed successfully" });
    } catch (error) {
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) {
        await sessionService.deleteSessionByToken(refreshToken);
      }
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken;

      await userService.logoutUser(refreshToken);

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none" as const,
      };

      res.clearCookie("accessToken", cookieOptions);
      res.clearCookie("refreshToken", cookieOptions);

      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      next(error);
    }
  },

  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        const error: CustomError = new Error("User not authenticated");
        error.statusCode = 401;
        throw error;
      }
      const { userId } = req.user;

      const user = await userService.getUserProfile(userId);

      res
        .status(200)
        .json({ data: user, message: "User fetched successfully" });
    } catch (error) {
      next(error);
    }
  },

  async sendVerificationEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const validationResult = verificationEmailSchema.safeParse(req.body);
      if (!validationResult.success) {
        const error: CustomError = new Error();
        error.statusCode = 400;
        error.message = validationResult.error.issues[0].message;
        throw error;
      }

      const { email, type, newEmail } = validationResult.data;

      await userService.sendVerificationEmail({
        email,
        type,
        newEmail,
      });

      res.status(200).json({ message: "Verification email sent successfully" });
    } catch (error) {
      next(error);
    }
  },

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const validationResult = verifyEmailSchema.safeParse(req.body);
      if (!validationResult.success) {
        const error: CustomError = new Error();
        error.statusCode = 400;
        error.message = validationResult.error.issues[0].message;
        throw error;
      }

      const { token, newEmail } = validationResult.data;

      await userService.verifyEmail({ token, newEmail });
      if (newEmail) {
        const cookieOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "none" as const,
        };

        res.clearCookie("accessToken", cookieOptions);
        res.clearCookie("refreshToken", cookieOptions);
      }

      res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
      next(error);
    }
  },

  async updateUserName(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        const error: CustomError = new Error("User not authenticated");
        error.statusCode = 401;
        throw error;
      }

      const { userId, userNameChangedAt } = req.user;

      const validationResult = userNameSchema.safeParse(req.body.userName);
      if (!validationResult.success) {
        const error: CustomError = new Error();
        error.statusCode = 400;
        throw error;
      }

      const userName = validationResult.data;

      const updatedUser = await userService.updateUserName({
        userId,
        userName,
        userNameChangedAt,
      });

      res
        .status(200)
        .json({ data: updatedUser, message: "Username updated successfully" });
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const resetPasswordDetails = req.body;

      const validationResult =
        resetPasswordSchema.safeParse(resetPasswordDetails);
      if (!validationResult.success) {
        const error: CustomError = new Error();
        error.statusCode = 400;
        error.message = validationResult.error.issues[0].message;
        throw error;
      }

      const { token, newPassword } = validationResult.data;

      await userService.updatePassword({
        token,
        newPassword,
      });

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none" as const,
      };

      res.clearCookie("accessToken", cookieOptions);
      res.clearCookie("refreshToken", cookieOptions);

      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      next(error);
    }
  },
};

export default authController;
