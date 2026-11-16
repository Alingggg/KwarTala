import type { UserPayload } from "@/types/index";
import { generateToken } from "@/utils/index";

const testUser: UserPayload = {
  userId: 1,
  userName: "tester",
  email: "tester@example.com",
  isVerified: true,
  emailChangedAt: new Date("2020-01-01"),
  passwordChangedAt: new Date("2020-01-01"),
};

function authCookie(user: UserPayload = testUser) {
  return `accessToken=${generateToken(user, "access-token")}`;
}

function refreshCookie(user: UserPayload = testUser) {
  return `refreshToken=${generateToken(user, "refresh-token")}`;
}

export { testUser, authCookie, refreshCookie };
