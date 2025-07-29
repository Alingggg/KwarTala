import { userRepository } from "@/repositories";
import { sessionService } from "@/services";
import type { CustomError, User } from "@/types";
import { generateToken, verifyToken } from "@/utils";
import bcrypt from "bcrypt";

const userService = {
  async registerUser({
    firstName,
    lastName,
    email,
    password,
  }: Omit<User, "id">) {
    if (!firstName || !lastName || !email || !password) {
      const error: CustomError = new Error("All fields are required.");
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      const error: CustomError = new Error("User already exists");
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

    if (!newUser) {
      const error: CustomError = new Error("Failed to create user.");
      error.statusCode = 500;
      throw error;
    }

    const { password: userPassword, ...userWithoutPassword } = newUser;

    return userWithoutPassword;
  },

  async loginUser({ email, password }: { email: string; password: string }) {
    if (!email || !password) {
      const error: CustomError = new Error("Email and password are required.");
      error.statusCode = 400;
      throw error;
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error: CustomError = new Error("Invalid email or password.");
      error.statusCode = 401;
      throw error;
    }
    const { password: userPassword, ...userWithoutPassword } = user;

    const isPasswordValid = await bcrypt.compare(password, userPassword);
    if (!isPasswordValid) {
      const error: CustomError = new Error("Invalid email or password.");
      error.statusCode = 401;
      throw error;
    }

    const payload = {
      userId: user.id,
      ...userWithoutPassword,
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
      user: userWithoutPassword,
    };
  },

  async refreshAccessToken(refreshToken: string) {
    if (!refreshToken) {
      const error: CustomError = new Error("Refresh token is required.");
      error.statusCode = 401;
      throw error;
    }

    const session = await sessionService.findSessionByToken(refreshToken);
    if (!session) {
      const error: CustomError = new Error("Invalid refresh token.");
      error.statusCode = 401;
      throw error;
    }

    let cleanPayload;
    try {
      const payload = verifyToken(refreshToken, "refresh-token");
      if (!payload) {
        const error: CustomError = new Error("Invalid token payload.");
        error.statusCode = 401;
        throw error;
      }

      const { iat, exp, ...rest } = payload as any;
      cleanPayload = rest;
    } catch (error) {
      const err: CustomError = new Error("Invalid or expired refresh token.");
      err.statusCode = 401;
      await sessionService.deleteSessionByToken(refreshToken);
      throw err;
    }

    const newAccessToken = generateToken(cleanPayload, "access-token");

    return newAccessToken;
  },

  async logoutUser(refreshToken: string) {
    if (!refreshToken) {
      const error: CustomError = new Error("Refresh token is required.");
      error.statusCode = 401;
      throw error;
    }

    await sessionService.deleteSessionByToken(refreshToken);
  },

  async getUserProfile(userId: number) {
    if (!userId) {
      const error: CustomError = new Error("User ID is required.");
      error.statusCode = 400;
      throw error;
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      const error: CustomError = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  },

  async findUserById(id: number) {
    return await userRepository.findById(id);
  },

  async findUserByEmail(email: string) {
    return await userRepository.findByEmail(email);
  },

  async updateUser(userData: User) {
    return userRepository.update(userData);
  },

  async deleteUser(id: number) {
    return userRepository.delete(id);
  },
};

export default userService;
