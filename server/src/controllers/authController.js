import { sessionService, userService } from "#services";

const authController = {
  async register(req, res, next) {
    try {
      const { firstName, lastName, email, password } = req.body;

      if (!firstName || !lastName || !email || !password) {
        const error = new Error("All fields are required");
        error.statusCode = 400;
        return next(error);
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

  async login(req, res, next) {
    try {
      const hasAccessToken = req.cookies.accessToken;
      const hasRefreshToken = req.cookies.refreshToken;

      if (hasAccessToken || hasRefreshToken) {
        const error = new Error("Already logged in");
        error.statusCode = 409;
        return next(error);
      }

      const { email, password } = req.body;
      if (!email || !password) {
        const error = new Error("Email and password are required");
        error.statusCode = 400;
        return next(error);
      }

      const { user, accessToken, refreshToken } = await userService.loginUser({
        email,
        password,
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

      res.status(200).json({ data: user, message: "Login successful" });
    } catch (error) {
      next(error);
    }
  },

  async refreshAccessToken(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        const error = new Error("Refresh token is required");
        error.statusCode = 401;
        return next(error);
      }

      const newAccessToken = await userService.refreshAccessToken(refreshToken);

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.status(200).json({ message: "Access token refreshed successfully" });
    } catch (error) {
      error.statusCode = 401;
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

      await userService.logoutUser(refreshToken);

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

      if (!userId) {
        const error = new Error("User ID is required");
        error.statusCode = 400;
        return next(error);
      }

      const user = await userService.getUserProfile(userId);

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
