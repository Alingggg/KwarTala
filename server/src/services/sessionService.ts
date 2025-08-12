import { sessionRepository } from "@/repositories/index";

const sessionService = {
  async createSession({
    userId,
    refreshToken,
  }: {
    userId: number;
    refreshToken: string;
  }) {
    return sessionRepository.create({ userId, refreshToken });
  },

  async getSessionByUserId(userId: number) {
    return sessionRepository.getByUserId(userId);
  },

  async getSessionByToken(refreshToken: string) {
    return sessionRepository.getByToken(refreshToken);
  },

  async deleteSessionByUserId(userId: number) {
    return sessionRepository.deleteByUserId(userId);
  },

  async deleteSessionByToken(refreshToken: string) {
    return sessionRepository.deleteByToken(refreshToken);
  },
};

export default sessionService;
