import { userRepository } from "@/repositories/index";
import {
  emailService,
  sessionService,
  verificationTokenService,
} from "@/services/index";
import type { CustomError, User } from "@/types/index";
import { generateToken, verifyToken } from "@/utils/index";
import bcrypt from "bcrypt";
import { addMinutes } from "date-fns";

const userService = {
  async registerUser({
    userName,
    email,
    password,
  }: Omit<User, "id" | "isVerified">) {
    if (!userName || !email || !password) {
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
      userName,
      email,
      password: hashedPassword,
    });

    if (!newUser) {
      const error: CustomError = new Error("Failed to create user.");
      error.statusCode = 500;
      throw error;
    }

    const { password: userPassword, ...userWithoutPassword } = newUser;

    const payload = {
      userId: newUser.id,
      ...userWithoutPassword,
    };

    const token = generateToken(payload, "access-token");

    await verificationTokenService.createVerificationToken({
      userId: newUser.id,
      token,
      expiresAt: addMinutes(new Date(), 15),
    });

    await emailService.sendVerificationEmail({
      email: newUser.email,
      verificationLink: `http://localhost:5173/verify-email?token=${token}`,
    });

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

    if (!userWithoutPassword.isVerified) {
      const error: CustomError = new Error("Email not verified.");
      error.statusCode = 403;
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

  async sendVerificationEmail(email: string) {
    if (!email) {
      const error: CustomError = new Error("Email is required.");
      error.statusCode = 400;
      throw error;
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error: CustomError = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    const { password, ...userWithoutPassword } = user;

    const payload = {
      userId: user.id,
      ...userWithoutPassword,
    };

    const token = generateToken(payload, "access-token");

    await verificationTokenService.createVerificationToken({
      userId: user.id,
      token,
      expiresAt: addMinutes(new Date(), 15),
    });

    await emailService.sendVerificationEmail({
      email: user.email,
      verificationLink: `http://localhost:5173/verify-email?token=${token}`,
    });
  },

  async verifyEmail(token: string) {
    if (!token) {
      const error: CustomError = new Error("Token is required.");
      error.statusCode = 400;
      throw error;
    }

    const verificationToken = await verificationTokenService.findByToken(token);
    if (!verificationToken) {
      const error: CustomError = new Error("Invalid token.");
      error.statusCode = 401;
      throw error;
    }

    const tokenPayload = verifyToken(token, "access-token");
    if (!tokenPayload) {
      const error: CustomError = new Error("Token is invalid or expired.");
      error.statusCode = 401;
      throw error;
    }

    await verificationTokenService.deleteVerificationToken(token);

    const user = await this.findUserByEmail(tokenPayload.email);
    if (!user) {
      const error: CustomError = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    await userRepository.updateVerificationStatus({
      id: user.id,
      isVerified: true,
    });
  },

  async findUserById(id: number) {
    return await userRepository.findById(id);
  },

  async findUserByEmail(email: string) {
    return await userRepository.findByEmail(email);
  },

  async updateUserCredentials(userData: User) {
    return userRepository.updateCredentials(userData);
  },

  async deleteUser(id: number) {
    return userRepository.delete(id);
  },
};

export default userService;
