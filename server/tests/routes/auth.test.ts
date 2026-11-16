import { describe, expect, it, vi } from "vitest";
import request from "supertest";
import app from "@/app";
import { authService, sessionService } from "@/services/index";
import { HttpError } from "@/types/index";
import { authCookie, refreshCookie, testUser } from "../helpers";

const auth = vi.mocked(authService);
const session = vi.mocked(sessionService);

function cookiesOf(res: request.Response): string[] {
  const header = res.headers["set-cookie"];
  return Array.isArray(header) ? header : header ? [header] : [];
}

describe("POST /api/auth/login", () => {
  const body = { email: "tester@example.com", password: "whatever" };

  it("returns 409 when already logged in", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .set("Cookie", authCookie())
      .send(body);
    expect(res.status).toBe(409);
    expect(auth.loginUser).not.toHaveBeenCalled();
  });

  it("returns 400 on invalid input", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "tester@example.com" });
    expect(res.status).toBe(400);
  });

  it("passes through service errors", async () => {
    auth.loginUser.mockRejectedValue(
      new HttpError(401, "Invalid email or password.")
    );
    const res = await request(app).post("/api/auth/login").send(body);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid email or password.");
  });

  it("sets httpOnly auth cookies on success", async () => {
    auth.loginUser.mockResolvedValue({
      user: { id: 1 } as any,
      accessToken: "access123",
      refreshToken: "refresh123",
    });
    const res = await request(app).post("/api/auth/login").send(body);
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({ id: 1 });
    const cookies = cookiesOf(res);
    expect(cookies.find((c) => c.startsWith("accessToken=access123"))).toMatch(
      /HttpOnly/
    );
    expect(cookies.find((c) => c.startsWith("refreshToken=refresh123"))).toMatch(
      /HttpOnly/
    );
  });
});

describe("POST /api/auth/refresh-token", () => {
  it("returns 401 without a refresh token", async () => {
    const res = await request(app).post("/api/auth/refresh-token");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Refresh token is required");
  });

  it("sets a new access token", async () => {
    auth.refreshAccessToken.mockResolvedValue("newAccess");
    const res = await request(app)
      .post("/api/auth/refresh-token")
      .set("Cookie", "refreshToken=abc");
    expect(res.status).toBe(200);
    expect(auth.refreshAccessToken).toHaveBeenCalledWith("abc");
    expect(cookiesOf(res).some((c) => c.startsWith("accessToken=newAccess"))).toBe(
      true
    );
  });

  it("deletes the session when refreshing fails", async () => {
    auth.refreshAccessToken.mockRejectedValue(
      new HttpError(401, "Invalid refresh token.")
    );
    const res = await request(app)
      .post("/api/auth/refresh-token")
      .set("Cookie", "refreshToken=abc");
    expect(res.status).toBe(401);
    expect(session.deleteSessionByToken).toHaveBeenCalledWith("abc");
  });
});

describe("POST /api/auth/logout", () => {
  it("clears both cookies", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", "refreshToken=abc");
    expect(res.status).toBe(200);
    expect(auth.logoutUser).toHaveBeenCalledWith("abc");
    const cookies = cookiesOf(res);
    expect(cookies.some((c) => /^accessToken=;.*Expires=Thu, 01 Jan 1970/.test(c))).toBe(
      true
    );
    expect(cookies.some((c) => /^refreshToken=;.*Expires=Thu, 01 Jan 1970/.test(c))).toBe(
      true
    );
  });
});

describe("GET /api/auth/me", () => {
  it("returns 401 without a cookie", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("returns the profile for the token's user", async () => {
    auth.getUserProfile.mockResolvedValue({ id: 1, userName: "tester" } as any);
    const res = await request(app).get("/api/auth/me").set("Cookie", authCookie());
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({ id: 1, userName: "tester" });
    expect(auth.getUserProfile).toHaveBeenCalledWith(testUser.userId);
  });

  it("returns 404 when the user is gone", async () => {
    auth.getUserProfile.mockRejectedValue(new HttpError(404, "User not found."));
    const res = await request(app).get("/api/auth/me").set("Cookie", authCookie());
    expect(res.status).toBe(404);
  });
});

describe("POST /api/auth/change-username", () => {
  it("requires auth", async () => {
    const res = await request(app)
      .post("/api/auth/change-username")
      .send({ userName: "newname" });
    expect(res.status).toBe(401);
  });

  it("validates the username", async () => {
    const res = await request(app)
      .post("/api/auth/change-username")
      .set("Cookie", authCookie())
      .send({ userName: "a" });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Username must be at least 3 characters");
  });

  it("updates the username", async () => {
    auth.updateUserName.mockResolvedValue({ id: 1, userName: "newname" } as any);
    const res = await request(app)
      .post("/api/auth/change-username")
      .set("Cookie", authCookie())
      .send({ userName: " newname " });
    expect(res.status).toBe(200);
    expect(auth.updateUserName).toHaveBeenCalledWith({
      userId: testUser.userId,
      userName: "newname",
    });
  });
});

describe("POST /api/auth/reset-password", () => {
  it("rejects a weak password", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({ token: "tok", newPassword: "weak" });
    expect(res.status).toBe(400);
    expect(auth.updatePassword).not.toHaveBeenCalled();
  });

  it("resets the password", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({ token: "tok", newPassword: "Passw0rd!" });
    expect(res.status).toBe(200);
    expect(auth.updatePassword).toHaveBeenCalledWith({
      token: "tok",
      newPassword: "Passw0rd!",
    });
  });
});

describe("POST /api/auth/has-to-re-login", () => {
  it("returns 401 without a refresh token", async () => {
    const res = await request(app)
      .post("/api/auth/has-to-re-login")
      .set("Cookie", authCookie());
    expect(res.status).toBe(401);
  });

  it("returns the service result", async () => {
    auth.hasToReLogIn.mockResolvedValue(true);
    const refresh = refreshCookie();
    const res = await request(app)
      .post("/api/auth/has-to-re-login")
      .set("Cookie", [authCookie(), refresh]);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ hasToReLogIn: true });
    expect(auth.hasToReLogIn).toHaveBeenCalledWith({
      userId: testUser.userId,
      refreshToken: refresh.split("=")[1],
    });
  });
});
