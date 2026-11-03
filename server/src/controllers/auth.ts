import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  userNameSchema,
  verificationEmailSchema,
  verifyEmailSchema,
} from "@/zod-schemas/index";
import { sessionService, authService } from "@/services/index";
import { HttpError } from "@/types/index";
import type { NextFunction, Request, Response } from "express";

const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validationResult = registerSchema.safeParse(req.body);
      if (!validationResult.success) {
        throw new HttpError(400, validationResult.error.issues[0].message);
      }

      const { userName, email, password } = validationResult.data;

      const existingUser = await authService.getUserByEmail(email);
      if (existingUser) {
        throw new HttpError(409, "User already exists");
      }

      const newUser = await authService.registerUser({
        userName,
        email,
        password,
      });
      if (!newUser) {
        throw new HttpError(500, "User registration failed");
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
        throw new HttpError(409, "Already logged in");
      }

      const validationResult = loginSchema.safeParse(req.body);
      if (!validationResult.success) {
        throw new HttpError(400, validationResult.error.issues[0].message);
      }

      const { email, password } = validationResult.data;

      const { user, accessToken, refreshToken } = await authService.loginUser({
        email,
        password,
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:
          process.env.NODE_ENV === "production"
            ? ("none" as const)
            : ("lax" as const),
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:
          process.env.NODE_ENV === "production"
            ? ("none" as const)
            : ("lax" as const),
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
        throw new HttpError(401, "Refresh token is required");
      }

      const newAccessToken = await authService.refreshAccessToken(refreshToken);

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:
          process.env.NODE_ENV === "production"
            ? ("none" as const)
            : ("lax" as const),
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

      await authService.logoutUser(refreshToken);

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:
          process.env.NODE_ENV === "production"
            ? ("none" as const)
            : ("lax" as const),
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
        throw new HttpError(401, "User not authenticated");
      }
      const { userId } = req.user;

      const user = await authService.getUserProfile(userId);

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
        throw new HttpError(400, validationResult.error.issues[0].message);
      }

      const { email, type, newEmail } = validationResult.data;

      await authService.sendVerificationEmail({
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
        throw new HttpError(400, validationResult.error.issues[0].message);
      }

      const { token, newEmail } = validationResult.data;

      await authService.verifyEmail({ token, newEmail });
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
        throw new HttpError(401, "User not authenticated");
      }

      const { userId } = req.user;

      const validationResult = userNameSchema.safeParse(req.body.userName);
      if (!validationResult.success) {
        throw new HttpError(400, validationResult.error.issues[0].message);
      }

      const userName = validationResult.data;

      const updatedUser = await authService.updateUserName({
        userId,
        userName,
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
        throw new HttpError(400, validationResult.error.issues[0].message);
      }

      const { token, newPassword } = validationResult.data;

      await authService.updatePassword({
        token,
        newPassword,
      });

      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      next(error);
    }
  },

  async checkHasToReLogIn(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new HttpError(401, "User not authenticated");
      }

      if (!req.user) {
        throw new HttpError(401, "User not authenticated");
      }

      const userId = req.user.userId;

      const hasToReLogIn = await authService.hasToReLogIn({
        userId,
        refreshToken,
      });

      res.status(200).json({ hasToReLogIn });
    } catch (error) {
      next(error);
    }
  },
};

export default authController;
