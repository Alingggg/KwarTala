import { userRepository } from "@/repositories/index";
import {
  emailService,
  sessionService,
  verificationTokenService,
} from "@/services/index";
import type { CustomError, User } from "@/types/index";
import { generateToken, verifyToken } from "@/utils/index";
import bcrypt from "bcrypt";
import { addMinutes, subDays } from "date-fns";

const userService = {
  async registerUser({
    userName,
    email,
    password,
  }: Pick<User, "userName" | "email" | "password">) {
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

  async sendVerificationEmail({
    email,
    type,
    newEmail,
  }: {
    email: string;
    type: "register" | "change-email" | "reset-password";
    newEmail?: string;
  }) {
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

    let subject;
    let mainTitle: string;
    let mainText: string;
    let buttonLabel: string;
    let path: string;

    let params = `?token=${token}`;

    if (type === "register") {
      subject = "🔐 Verify Your Email - KwarTala";
      mainTitle = "Verify Your Email";
      mainText = "Please click the button below to verify your email address.";
      buttonLabel = "Verify Email Address";
      path = "/verify-email";
      if (newEmail) params += `&newEmail=${newEmail}`;
    } else if (type === "change-email") {
      subject = "🔐 Change Your Email - KwarTala";
      mainTitle = "Change Your Email";
      mainText = "Please click the button below to change your email address.";
      buttonLabel = "Change Email Address";
      path = "/change-email";
      params += `&oldEmail=${email}`;
    } else {
      subject = "🔐 Reset Your Password - KwarTala";
      mainTitle = "Reset Your Password";
      mainText = "Please click the button below to reset your password.";
      buttonLabel = "Reset Password";
      path = "/reset-password";
    }

    await emailService.sendVerificationEmail({
      email: newEmail ? newEmail : user.email,
      verificationLink: `${process.env.FRONTEND_URL}${path}${params}`,
      subject,
      mainTitle,
      mainText,
      buttonLabel,
    });
  },

  async verifyEmail({ token, newEmail }: { token: string; newEmail?: string }) {
    if (!token) {
      const error: CustomError = new Error("Token is required.");
      error.statusCode = 400;
      throw error;
    }

    const verificationToken = await verificationTokenService.findByToken(token);
    if (!verificationToken) {
      const error: CustomError = new Error("Invalid or expired token.");
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

    if (!newEmail) {
      await userRepository.updateVerificationStatus({
        id: user.id,
        isVerified: true,
      });
    } else {
      await this.updateEmail({
        token,
        email: newEmail as string,
      });
    }
  },

  async updateUserName({
    userId,
    userName,
    userNameChangedAt,
  }: {
    userId: number;
    userName: string;
    userNameChangedAt: Date | string;
  }) {
    const CHANGE_COOLDOWN_DAYS = 30;

    if (!userId || !userName || !userNameChangedAt) {
      const error: CustomError = new Error(
        "ID, username, and username changed date are required."
      );
      error.statusCode = 400;
      throw error;
    }

    if (
      new Date(userNameChangedAt) > subDays(new Date(), CHANGE_COOLDOWN_DAYS)
    ) {
      const error: CustomError = new Error(
        "Username can only be changed once every 30 days."
      );
      error.statusCode = 400;
      throw error;
    }

    return await userRepository.updateUserName({ id: userId, userName });
  },

  async updateEmail({ token, email }: { token: string; email: string }) {
    const CHANGE_COOLDOWN_DAYS = 30;

    if (!token || !email) {
      const error: CustomError = new Error("Token and email are required.");
      error.statusCode = 400;
      throw error;
    }

    const tokenPayload = verifyToken(token, "access-token");
    if (!tokenPayload) {
      const error: CustomError = new Error("Token is invalid or expired.");
      error.statusCode = 401;
      throw error;
    }

    const user = await this.findUserById(tokenPayload.userId);
    if (!user) {
      const error: CustomError = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    if (
      new Date(user.emailChangedAt) > subDays(new Date(), CHANGE_COOLDOWN_DAYS)
    ) {
      const error: CustomError = new Error(
        "Email can only be changed once every 30 days."
      );
      error.statusCode = 400;
      throw error;
    }

    await userRepository.updateEmail({ id: user.id, email });
    await sessionService.deleteSessionByUserId(user.id);
  },

  async updatePassword({
    token,
    newPassword,
  }: {
    token: string;
    newPassword: string;
  }) {
    const CHANGE_COOLDOWN_DAYS = 30;

    if (!token || !newPassword) {
      const error: CustomError = new Error(
        "Token and new password are required."
      );
      error.statusCode = 400;
      throw error;
    }

    const verificationToken = await verificationTokenService.findByToken(token);
    if (!verificationToken) {
      const error: CustomError = new Error("Invalid or expired token.");
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

    const user = await this.findUserById(tokenPayload.userId);
    if (!user) {
      const error: CustomError = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    if (
      new Date(user.passwordChangedAt) >
      subDays(new Date(), CHANGE_COOLDOWN_DAYS)
    ) {
      const error: CustomError = new Error(
        "Password can only be changed once every 30 days."
      );
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userRepository.updatePassword({
      id: user.id,
      password: hashedPassword,
    });
    await sessionService.deleteSessionByUserId(user.id);
  },

  async findUserById(id: number) {
    return await userRepository.findById(id);
  },

  async findUserByEmail(email: string) {
    return await userRepository.findByEmail(email);
  },

  async deleteUser(id: number) {
    return userRepository.delete(id);
  },
};

export default userService;
