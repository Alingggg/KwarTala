import bcrypt from "bcrypt";
import { sessionService, userService } from "#services";
import { generateToken, verifyToken } from "#utils";

const authController = {
  async register(req, res, next) {
    try {
      const { firstName, lastName, email, password } = req.body;

      if (!firstName || !lastName || !email || !password) {
        const error = new Error("All fields are required");
        error.status = 400;
        return next(error);
      }

      const existingUser = await userService.findUserByEmail(email);
      if (existingUser) {
        const error = new Error("User already exists");
        error.status = 409;
        return next(error);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await userService.createUser({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const hasAccessToken = req.cookies.accessToken;
      const hasRefreshToken = req.cookies.refreshToken;
      if (hasAccessToken || hasRefreshToken) {
        const error = new Error("Already logged in");
        error.status = 409;
        return next(error);
      }

      const { email, password } = req.body;
      if (!email || !password) {
        const error = new Error("Email and password are required");
        error.status = 400;
        return next(error);
      }

      const user = await userService.findUserByEmail(email);
      if (!user) {
        const error = new Error("Invalid email or password");
        error.status = 401;
        return next(error);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        const error = new Error("Invalid email or password");
        error.status = 401;
        return next(error);
      }

      const payload = {
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };

      const accessToken = generateToken(payload, "access-token");
      const refreshToken = generateToken(payload, "refresh-token");

      await sessionService.createSession({
        userId: user.id,
        refreshToken,
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      next(error);
    }
  },

  async refreshToken(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        const error = new Error("Refresh token is required");
        error.status = 401;
        return next(error);
      }

      let cleanPayload;
      try {
        const payload = verifyToken(refreshToken, "refresh-token");
        cleanPayload = {
          userId: payload.userId,
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
        };
      } catch (error) {
        const err = new Error("Invalid or expired refresh token");
        err.status = 401;
        await sessionService.deleteSessionByToken(refreshToken);
        return next(err);
      }

      const session = await sessionService.findSessionByToken(refreshToken);
      if (!session) {
        const error = new Error("Invalid or expired refresh token");
        error.status = 401;
        await sessionService.deleteSessionByToken(refreshToken);
        return next(error);
      }

      const newAccessToken = generateToken(cleanPayload, "access-token");

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.status(200).json({ message: "Access token refreshed successfully" });
    } catch (error) {
      error.status = 401;
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) {
        await sessionService.deleteSessionByToken(refreshToken);
      }
      next(error);
    }
  },

  async logout(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;
      await sessionService.deleteSessionByToken(refreshToken);
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      next(error);
    }
  },

  async getCurrentUser(req, res, next) {
    try {
      const { userId } = req.user;

      const user = await userService.findUserById(userId);
      if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        return next(error);
      }

      res.status(200).json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default authController;
