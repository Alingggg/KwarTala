import { describe, expect, it, vi } from "vitest";
import request from "supertest";
import app from "@/app";
import { clearHistory, getHistory, runChat, saveHistory } from "@/ai/index";
import { authCookie, testUser } from "../helpers";

const body = { message: "How much did I spend?", currency: "PHP" };

describe("POST /api/chat", () => {
  it("requires auth", async () => {
    const res = await request(app).post("/api/chat").send(body);
    expect(res.status).toBe(401);
  });

  it("returns 400 on invalid input", async () => {
    const res = await request(app)
      .post("/api/chat")
      .set("Cookie", authCookie())
      .send({ message: "", currency: "PHP" });
    expect(res.status).toBe(400);
    expect(runChat).not.toHaveBeenCalled();
  });

  it("streams deltas and a done event", async () => {
    vi.mocked(getHistory).mockResolvedValue([]);
    vi.mocked(runChat).mockImplementation(async ({ onDelta }) => {
      onDelta("Hello");
      onDelta(" there");
      return { history: [{ role: "model" }], dataChanged: true } as any;
    });

    const res = await request(app)
      .post("/api/chat")
      .set("Cookie", authCookie())
      .send(body);

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("text/event-stream");
    expect(res.text).toBe(
      'event: delta\ndata: {"text":"Hello"}\n\n' +
        'event: delta\ndata: {"text":" there"}\n\n' +
        'event: done\ndata: {"dataChanged":true}\n\n'
    );
    expect(runChat).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: testUser.userId,
        userName: testUser.userName,
        currency: "PHP",
        message: body.message,
        history: [],
      })
    );
    expect(saveHistory).toHaveBeenCalledWith(testUser.userId, [{ role: "model" }]);
  });

  it("sends an error event when the model fails", async () => {
    vi.mocked(getHistory).mockResolvedValue([]);
    vi.mocked(runChat).mockRejectedValue(new Error("boom"));

    const res = await request(app)
      .post("/api/chat")
      .set("Cookie", authCookie())
      .send(body);

    expect(res.status).toBe(200);
    expect(res.text).toContain("event: error");
    expect(res.text).not.toContain("boom");
    expect(saveHistory).not.toHaveBeenCalled();
  });
});

describe("DELETE /api/chat", () => {
  it("clears the user's history", async () => {
    const res = await request(app)
      .delete("/api/chat")
      .set("Cookie", authCookie());
    expect(res.status).toBe(200);
    expect(clearHistory).toHaveBeenCalledWith(testUser.userId);
  });
});
