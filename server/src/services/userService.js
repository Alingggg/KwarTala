import { userRepository } from "#repositories";
import { sessionService } from "#services";
import { generateToken, verifyToken } from "#utils";
import bcrypt from "bcrypt";

const userService = {
  async registerUser({ firstName, lastName, email, password }) {
    if (!firstName || !lastName || !email || !password) {
      const error = new Error("All fields are required.");
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    return {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
    };
  },

  async loginUser({ email, password }) {
    if (!email || !password) {
      const error = new Error("Email and password are required.");
      error.statusCode = 400;
      throw error;
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error = new Error("Invalid email or password.");
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error("Invalid email or password.");
      error.statusCode = 401;
      throw error;
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

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
  },

  async refreshAccessToken(refreshToken) {
    if (!refreshToken) {
      const error = new Error("Refresh token is required.");
      error.statusCode = 401;
      throw error;
    }

    let cleanPayload;
    try {
      const payload = verifyToken(refreshToken, "refresh-token");
      cleanPayload = {
        userId: payload?.userId,
        firstName: payload?.firstName,
        lastName: payload?.lastName,
        email: payload?.email,
      };
    } catch (error) {
      const err = new Error("Invalid or expired refresh token.");
      err.statusCode = 401;
      await sessionService.deleteSessionByToken(refreshToken);
      throw err;
    }

    const session = await sessionService.findSessionByToken(refreshToken);
    if (!session) {
      const error = new Error("Invalid or expired refresh token.");
      error.statusCode = 401;
      await sessionService.deleteSessionByToken(refreshToken);
      throw error;
    }

    const newAccessToken = generateToken(cleanPayload, "access-token");

    return newAccessToken;
  },

  async logoutUser(refreshToken) {
    if (!refreshToken) {
      const error = new Error("Refresh token is required.");
      error.statusCode = 401;
      throw error;
    }

    await sessionService.deleteSessionByToken(refreshToken);
  },

  async getUserProfile(userId) {
    if (!userId) {
      const error = new Error("User ID is required.");
      error.statusCode = 400;
      throw error;
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  },

  async findUserById(id) {
    const user = await userRepository.findById(id);
    if (user && user.password) {
      const { password, ...rest } = user;
      return rest;
    }
    return user;
  },

  async findUserByEmail(email) {
    const user = await userRepository.findByEmail(email);
    if (user && user.password) {
      const { password, ...rest } = user;
      return rest;
    }
    return user;
  },

  async updateUser(id, userData) {
    return userRepository.update(id, userData);
  },

  async deleteUser(id) {
    return userRepository.delete(id);
  },
};

export default userService;
