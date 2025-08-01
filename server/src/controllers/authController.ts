import { sessionService, userService } from "@/services/index";
import type { CustomError } from "@/types/index";
import type { NextFunction, Request, Response } from "express";

const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { firstName, lastName, email, password } = req.body;

      if (!firstName || !lastName || !email || !password) {
        const error: CustomError = new Error("All fields are required");
        error.statusCode = 400;
        throw error;
      }

      if (firstName.length < 2 || firstName.length > 50) {
        const error: CustomError = new Error(
          "First name must be between 2 and 50 characters"
        );
        error.statusCode = 400;
        throw error;
      }
      if (!/^[A-Za-z\s'-]+$/.test(firstName)) {
        const error: CustomError = new Error(
          "Only letters, spaces, apostrophes, and hyphens allowed"
        );
        error.statusCode = 400;
        throw error;
      }

      if (lastName.length < 2 || lastName.length > 50) {
        const error: CustomError = new Error(
          "Last name must be between 2 and 50 characters"
        );
        error.statusCode = 400;
        throw error;
      }
      if (!/^[A-Za-z\s'-]+$/.test(lastName)) {
        const error: CustomError = new Error(
          "Only letters, spaces, apostrophes, and hyphens allowed"
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
        firstName,
        lastName,
        email,
        password,
      });

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
};

export default authController;
