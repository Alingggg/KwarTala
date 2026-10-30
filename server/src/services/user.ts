import db, { users } from "@/db/index";
import { clearHistory } from "@/ai/history";
import {
  emailService,
  sessionService,
  verificationTokenService,
} from "@/services/index";
import { HttpError, type User } from "@/types/index";
import { generateToken, verifyToken } from "@/utils/index";
import bcrypt from "bcrypt";
import { addMinutes, format, isBefore, subDays } from "date-fns";
import { eq } from "drizzle-orm";

const userService = {
  async registerUser({
    userName,
    email,
    password,
  }: Pick<User, "userName" | "email" | "password">) {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    if (existingUser) {
      throw new HttpError(409, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db
      .insert(users)
      .values({
        userName,
        email,
        password: hashedPassword,
      })
      .returning();
    if (!newUser) {
      throw new HttpError(500, "Failed to create user.");
    }

    const { password: userPassword, ...userWithoutPassword } = newUser;

    return userWithoutPassword;
  },

  async loginUser({ email, password }: { email: string; password: string }) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
      throw new HttpError(401, "Invalid email or password.");
    }
    const { password: userPassword, ...userWithoutPassword } = user;

    const isPasswordValid = await bcrypt.compare(password, userPassword);
    if (!isPasswordValid) {
      throw new HttpError(401, "Invalid email or password.");
    }

    if (!userWithoutPassword.isVerified) {
      throw new HttpError(403, "Email not verified.");
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
    const session = await sessionService.getSessionByToken(refreshToken);
    if (!session) {
      throw new HttpError(401, "Invalid refresh token.");
    }

    let cleanPayload;
    try {
      const payload = verifyToken(refreshToken, "refresh-token");
      if (!payload) {
        throw new HttpError(401, "Invalid token payload.");
      }

      const { iat, exp, ...rest } = payload as any;
      cleanPayload = rest;
    } catch (error) {
      await sessionService.deleteSessionByToken(refreshToken);
      throw new HttpError(401, "Invalid or expired refresh token.");
    }

    const newAccessToken = generateToken(cleanPayload, "access-token");

    return newAccessToken;
  },

  async logoutUser(refreshToken: string) {
    const session = await sessionService.deleteSessionByToken(refreshToken);
    if (session) {
      await clearHistory(session.userId).catch((error) =>
        console.error("Failed to clear chat history:", error)
      );
    }
  },

  async getUserProfile(userId: number) {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
      throw new HttpError(404, "User not found.");
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
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
      throw new HttpError(404, "User not found.");
    }

    if (type === "change-email") {
      const allowed = this.canChangeEmail(user);
      if (!allowed) {
        throw new HttpError(400, 
          "Email can only be changed once every 30 days."
        );
      }
    }

    if (type === "reset-password") {
      const allowed = this.canChangePassword(user);
      if (!allowed) {
        throw new HttpError(400, 
          "Password can only be changed once every 30 days."
        );
      }
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
      expiresAt: format(addMinutes(new Date(), 15), "yyyy-MM-dd"),
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
    const verificationToken = await verificationTokenService.getByToken(token);
    if (!verificationToken) {
      throw new HttpError(401, "Invalid or expired token.");
    }

    const tokenPayload = verifyToken(token, "access-token");
    if (!tokenPayload) {
      throw new HttpError(401, "Token is invalid or expired.");
    }

    await verificationTokenService.deleteVerificationToken(token);

    const user = await this.getUserByEmail(tokenPayload.email);
    if (!user) {
      throw new HttpError(404, "User not found.");
    }

    if (!newEmail) {
      await db
        .update(users)
        .set({
          isVerified: true,
        })
        .where(eq(users.id, user.id));
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
  }: {
    userId: number;
    userName: string;
  }) {
    const [user] = await db
      .update(users)
      .set({
        userName,
      })
      .where(eq(users.id, userId))
      .returning();

    return user;
  },

  async updateEmail({ token, email }: { token: string; email: string }) {
    const tokenPayload = verifyToken(token, "access-token");
    if (!tokenPayload) {
      throw new HttpError(401, "Token is invalid or expired.");
    }

    const user = await this.getUserById(tokenPayload.userId);
    if (!user) {
      throw new HttpError(404, "User not found.");
    }

    if (!this.canChangeEmail(user)) {
      throw new HttpError(400, 
        "Email can only be changed once every 30 days."
      );
    }

    await db
      .update(users)
      .set({
        email,
        emailChangedAt: format(new Date(), "yyyy-MM-dd"),
      })
      .where(eq(users.id, user.id));
    await sessionService.deleteSessionByUserId(user.id);
  },

  async updatePassword({
    token,
    newPassword,
  }: {
    token: string;
    newPassword: string;
  }) {
    const verificationToken = await verificationTokenService.getByToken(token);
    if (!verificationToken) {
      throw new HttpError(401, "Invalid or expired token.");
    }

    const tokenPayload = verifyToken(token, "access-token");
    if (!tokenPayload) {
      throw new HttpError(401, "Token is invalid or expired.");
    }

    await verificationTokenService.deleteVerificationToken(token);

    const user = await this.getUserById(tokenPayload.userId);
    if (!user) {
      throw new HttpError(404, "User not found.");
    }

    if (!this.canChangePassword(user)) {
      throw new HttpError(400, 
        "Password can only be changed once every 30 days."
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db
      .update(users)
      .set({
        password: hashedPassword,
        passwordChangedAt: format(new Date(), "yyyy-MM-dd"),
      })
      .where(eq(users.id, user.id))
      .returning();
  },

  canChangeEmail(user: User) {
    const CHANGE_COOLDOWN_DAYS = 30;

    return !(
      new Date(user.emailChangedAt) > subDays(new Date(), CHANGE_COOLDOWN_DAYS)
    );
  },

  canChangePassword(user: User) {
    const CHANGE_COOLDOWN_DAYS = 30;

    return !(
      new Date(user.passwordChangedAt) >
      subDays(new Date(), CHANGE_COOLDOWN_DAYS)
    );
  },

  async hasToReLogIn({
    userId,
    refreshToken,
  }: {
    userId: number;
    refreshToken: string;
  }) {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new HttpError(404, "User not found.");
    }

    const session = await sessionService.getSessionByToken(refreshToken);
    if (!session) {
      throw new HttpError(401, "Invalid or expired session.");
    }

    if (
      isBefore(session.createdAt, user.emailChangedAt) ||
      isBefore(session.createdAt, user.passwordChangedAt)
    )
      return true;

    return false;
  },

  async getUserById(id: number) {
    const [user] = await db.select().from(users).where(eq(users.id, id));

    return user;
  },

  async getUserByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    return user;
  },

  async deleteUser(id: number) {
    const [user] = await db.delete(users).where(eq(users.id, id)).returning();

    return user;
  },
};

export default userService;
