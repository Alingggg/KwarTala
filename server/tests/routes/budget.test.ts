import { describe, expect, it, vi } from "vitest";
import request from "supertest";
import app from "@/app";
import { budgetService } from "@/services/index";
import { authCookie, testUser } from "../helpers";

const budgets = vi.mocked(budgetService);

describe("GET /api/budgets", () => {
  it("requires auth", async () => {
    const res = await request(app).get("/api/budgets?month=1&year=2024");
    expect(res.status).toBe(401);
  });

  it.each(["", "?month=13&year=2024", "?month=1&year=1999", "?month=x&year=2024"])(
    "returns 400 for query %j",
    async (query) => {
      const res = await request(app)
        .get(`/api/budgets${query}`)
        .set("Cookie", authCookie());
      expect(res.status).toBe(400);
    }
  );

  it("returns the budget", async () => {
    budgets.getBudgetByUserIdAndDate.mockResolvedValue({ amount: 5000 } as any);
    const res = await request(app)
      .get("/api/budgets?month=3&year=2024")
      .set("Cookie", authCookie());
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({ amount: 5000 });
    expect(budgets.getBudgetByUserIdAndDate).toHaveBeenCalledWith({
      userId: testUser.userId,
      month: 3,
      year: 2024,
    });
  });
});

describe("PUT /api/budgets", () => {
  it("validates the amount", async () => {
    const res = await request(app)
      .put("/api/budgets?month=3&year=2024")
      .set("Cookie", authCookie())
      .send({ amount: -10 });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Budget must not be negative");
  });

  it("updates the budget", async () => {
    budgets.updateBudgetByUserIdAndDate.mockResolvedValue({ amount: 8000 } as any);
    const res = await request(app)
      .put("/api/budgets?month=3&year=2024")
      .set("Cookie", authCookie())
      .send({ amount: 8000 });
    expect(res.status).toBe(200);
    expect(budgets.updateBudgetByUserIdAndDate).toHaveBeenCalledWith({
      userId: testUser.userId,
      month: 3,
      year: 2024,
      amount: 8000,
    });
  });
});
