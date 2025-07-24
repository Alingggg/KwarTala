import { sessionRepository } from "#repositories";

const sessionService = {
  async createSession({ userId, refreshToken }) {
    return sessionRepository.create({ userId, refreshToken });
  },

  async findSessionByUserId(userId) {
    return sessionRepository.findByUserId(userId);
  },

  async findSessionByToken(refreshToken) {
    return sessionRepository.findByToken(refreshToken);
  },

  async deleteSessionByUserId(userId) {
    return sessionRepository.deleteByUserId(userId);
  },

  async deleteSessionByToken(refreshToken) {
    return sessionRepository.deleteByToken(refreshToken);
  },
};

export default sessionService;
