import db, { emailVerificationTokens } from "@/db/index";
import { eq } from "drizzle-orm";

const verificationTokenService = {
  async createVerificationToken({
    userId,
    token,
    expiresAt,
  }: {
    userId: number;
    token: string;
    expiresAt: Date;
  }) {
    const [verificationToken] = await db
      .insert(emailVerificationTokens)
      .values({
        userId,
        token,
        expiresAt,
      })
      .returning();

    return verificationToken;
  },

  async getByToken(token: string) {
    const [verificationToken] = await db
      .select()
      .from(emailVerificationTokens)
      .where(eq(emailVerificationTokens.token, token));

    return verificationToken;
  },

  async deleteVerificationToken(token: string) {
    const [verificationToken] = await db
      .delete(emailVerificationTokens)
      .where(eq(emailVerificationTokens.token, token))
      .returning();

    return verificationToken;
  },
};

export default verificationTokenService;
