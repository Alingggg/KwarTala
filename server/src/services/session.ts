import db, { sessions } from "@/db/index";
import { eq } from "drizzle-orm";

const sessionService = {
  async createSession({
    userId,
    refreshToken,
  }: {
    userId: number;
    refreshToken: string;
  }) {
    const [session] = await db
      .insert(sessions)
      .values({
        userId,
        refreshToken,
      })
      .returning();

    return session;
  },

  async getSessionByUserId(userId: number) {
    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.userId, userId));

    return session;
  },

  async getSessionByToken(refreshToken: string) {
    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.refreshToken, refreshToken));

    return session;
  },

  async deleteSessionByUserId(userId: number) {
    const [session] = await db
      .delete(sessions)
      .where(eq(sessions.userId, userId))
      .returning();

    return session;
  },

  async deleteSessionByToken(refreshToken: string) {
    const [session] = await db
      .delete(sessions)
      .where(eq(sessions.refreshToken, refreshToken))
      .returning();

    return session;
  },
};

export default sessionService;
