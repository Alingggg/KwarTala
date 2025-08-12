import { verificationTokenRepository } from "@/repositories/index";

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
    return await verificationTokenRepository.create({
      userId,
      token,
      expiresAt,
    });
  },

  async getByToken(token: string) {
    return await verificationTokenRepository.getByToken(token);
  },

  async deleteVerificationToken(token: string) {
    return await verificationTokenRepository.deleteByToken(token);
  },
};

export default verificationTokenService;
