import { sessionService, userService } from "@/services/index";
import type { CustomError } from "@/types/index";
import type { NextFunction, Request, Response } from "express";

const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { userName, email, password } = req.body;

      if (!userName || !email || !password) {
        const error: CustomError = new Error("All fields are required");
        error.statusCode = 400;
        throw error;
      }

      if (userName.length < 3 || userName.length > 20) {
        const error: CustomError = new Error(
          "Username must be between 3 and 20 characters"
        );
        error.statusCode = 400;
        throw error;
      }
      if (!/^[a-zA-Z0-9]+$/.test(userName)) {
        const error: CustomError = new Error(
          "Username can only contain letters and numbers"
        );
        error.statusCode = 400;
        throw error;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        const error: CustomError = new Error("Invalid email format");
        error.statusCode = 400;
        throw error;
      }

      if (password.length < 8 || password.length > 64) {
        const error: CustomError = new Error(
          "Password must be between 8 and 64 characters"
        );
        error.statusCode = 400;
        throw error;
      }
      if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).+$/.test(password)) {
        const error: CustomError = new Error(
          "Must include upper & lowercase letters, a number, and a symbol"
        );
        error.statusCode = 400;
        throw error;
      }

      const existingUser = await userService.findUserByEmail(email);

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

      const { email, password } = req.body;
      if (!email || !password) {
        const error: CustomError = new Error("Email and password are required");
        error.statusCode = 400;
        throw error;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        const error: CustomError = new Error("Invalid email format");
        error.statusCode = 400;
        throw error;
      }

      if (password.length < 8 || password.length > 64) {
        const error: CustomError = new Error(
          "Password must be between 8 and 64 characters"
        );
        error.statusCode = 400;
        throw error;
      }
      if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).+$/.test(password)) {
        const error: CustomError = new Error(
          "Must include upper & lowercase letters, a number, and a symbol"
        );
        error.statusCode = 400;
        throw error;
      }

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

      if (!userId) {
        const error: CustomError = new Error("User ID is required");
        error.statusCode = 400;
        throw error;
      }

      const user = await userService.getUserProfile(userId);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },

  async sendVerificationEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, type, newEmail } = req.body;

      if (!email || !type) {
        const error: CustomError = new Error("Email and type are required");
        error.statusCode = 400;
        throw error;
      }

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
      const { token, newEmail } = req.body;

      if (!token) {
        const error: CustomError = new Error("Token is required");
        error.statusCode = 400;
        throw error;
      }

      await userService.verifyEmail({ token, newEmail });

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

      const { userName } = req.body;
      const { userId, userNameChangedAt } = req.user;

      if (!userName) {
        const error: CustomError = new Error("Username is required");
        error.statusCode = 400;
        throw error;
      }

      if (userName.length < 3 || userName.length > 20) {
        const error: CustomError = new Error(
          "Username must be between 3 and 20 characters"
        );
        error.statusCode = 400;
        throw error;
      }
      if (!/^[a-zA-Z0-9]+$/.test(userName)) {
        const error: CustomError = new Error(
          "Username can only contain letters and numbers"
        );
        error.statusCode = 400;
        throw error;
      }

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

  async updateEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, newEmail } = req.body;

      if (!token || !newEmail) {
        const error: CustomError = new Error(
          "Token and new email are required"
        );
        error.statusCode = 400;
        throw error;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
        const error: CustomError = new Error("Invalid email format");
        error.statusCode = 400;
        throw error;
      }

      const updatedUser = await userService.updateEmail({
        token,
        email: newEmail,
      });

      res
        .status(200)
        .json({ data: updatedUser, message: "Email updated successfully" });
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        const error: CustomError = new Error(
          "Token and new password are required"
        );
        error.statusCode = 400;
        throw error;
      }

      await userService.updatePassword({
        token,
        newPassword,
      });

      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      next(error);
    }
  },
};

export default authController;
