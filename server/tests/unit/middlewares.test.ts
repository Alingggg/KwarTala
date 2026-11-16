import { describe, expect, it } from "vitest";
import express from "express";
import cookieParser from "cookie-parser";
import request from "supertest";
import { authMiddleware, errorMiddleware } from "@/middlewares/index";
import { HttpError } from "@/types/index";
import { authCookie, refreshCookie, testUser } from "../helpers";

function buildApp() {
  const app = express();
  app.use(cookieParser());
  app.get("/http-error", () => {
    throw new HttpError(418, "I'm a teapot");
  });
  app.get("/crash", () => {
    throw new Error("secret details");
  });
  app.get("/protected", authMiddleware, (req, res) => {
    res.json({ user: req.user });
  });
  app.use(errorMiddleware);
  return app;
}

describe("errorMiddleware", () => {
  it("uses the HttpError status and message", async () => {
    const res = await request(buildApp()).get("/http-error");
    expect(res.status).toBe(418);
    expect(res.body).toEqual({ message: "I'm a teapot" });
  });

  it("hides unknown errors behind a 500", async () => {
    const res = await request(buildApp()).get("/crash");
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: "Internal server error" });
  });
});

describe("authMiddleware", () => {
  it("rejects requests without an access token", async () => {
    const res = await request(buildApp()).get("/protected");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Access token is required");
  });

  it("rejects an invalid access token", async () => {
    const res = await request(buildApp())
      .get("/protected")
      .set("Cookie", "accessToken=garbage");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid or expired token");
  });

  it("rejects a refresh token in the access token cookie", async () => {
    const token = refreshCookie().split("=")[1];
    const res = await request(buildApp())
      .get("/protected")
      .set("Cookie", `accessToken=${token}`);
    expect(res.status).toBe(401);
  });

  it("attaches the decoded user", async () => {
    const res = await request(buildApp())
      .get("/protected")
      .set("Cookie", authCookie());
    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({
      userId: testUser.userId,
      email: testUser.email,
    });
  });
});
