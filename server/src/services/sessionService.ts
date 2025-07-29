import { sessionRepository } from "@/repositories";

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

  async findSessionByUserId(userId: number) {
    return sessionRepository.findByUserId(userId);
  },

  async findSessionByToken(refreshToken: string) {
    return sessionRepository.findByToken(refreshToken);
  },

  async deleteSessionByUserId(userId: number) {
    return sessionRepository.deleteByUserId(userId);
  },

  async deleteSessionByToken(refreshToken: string) {
    return sessionRepository.deleteByToken(refreshToken);
  },
};

export default sessionService;
