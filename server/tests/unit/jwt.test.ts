import { afterEach, describe, expect, it, vi } from "vitest";
import { generateToken, verifyToken } from "@/utils/index";
import { HttpError } from "@/types/index";
import { testUser } from "../helpers";

describe("jwt utils", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it.each(["access-token", "refresh-token"] as const)(
    "round-trips a %s",
    (type) => {
      const token = generateToken(testUser, type);
      const decoded = verifyToken(token, type) as any;
      expect(decoded.userId).toBe(testUser.userId);
      expect(decoded.email).toBe(testUser.email);
      expect(decoded.jti).toEqual(expect.any(String));
    }
  );

  it("gives each token a unique jti", () => {
    const a = verifyToken(generateToken(testUser, "access-token"), "access-token") as any;
    const b = verifyToken(generateToken(testUser, "access-token"), "access-token") as any;
    expect(a.jti).not.toBe(b.jti);
  });

  it("sets access tokens to expire in 15 minutes", () => {
    const decoded = verifyToken(
      generateToken(testUser, "access-token"),
      "access-token"
    ) as any;
    expect(decoded.exp - decoded.iat).toBe(15 * 60);
  });

  it("sets refresh tokens to expire in 30 days", () => {
    const decoded = verifyToken(
      generateToken(testUser, "refresh-token"),
      "refresh-token"
    ) as any;
    expect(decoded.exp - decoded.iat).toBe(30 * 24 * 60 * 60);
  });

  it("rejects a refresh token used as an access token", () => {
    const token = generateToken(testUser, "refresh-token");
    expect(() => verifyToken(token, "access-token")).toThrow(HttpError);
  });

  it("rejects a tampered token with 401", () => {
    const token = generateToken(testUser, "access-token");
    const tampered = token.slice(0, -2) + (token.endsWith("aa") ? "bb" : "aa");
    try {
      verifyToken(tampered, "access-token");
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(HttpError);
      expect((err as HttpError).statusCode).toBe(401);
    }
  });

  it("rejects an expired token", () => {
    vi.useFakeTimers();
    try {
      const token = generateToken(testUser, "access-token");
      vi.advanceTimersByTime(16 * 60 * 1000);
      expect(() => verifyToken(token, "access-token")).toThrow(HttpError);
    } finally {
      vi.useRealTimers();
    }
  });

  it("throws when the secret is missing", () => {
    vi.stubEnv("JWT_ACCESS_TOKEN_SECRET", "");
    expect(() => generateToken(testUser, "access-token")).toThrow(
      "JWT secret is not defined"
    );
    expect(() => verifyToken("x", "access-token")).toThrow(
      "JWT secret is not defined"
    );
  });
});
