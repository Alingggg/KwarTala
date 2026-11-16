import { describe, expect, it, vi } from "vitest";
import request from "supertest";
import app from "@/app";
import { expenseService } from "@/services/index";
import { authCookie, testUser } from "../helpers";

const expenses = vi.mocked(expenseService);

const body = {
  category: "Food",
  description: "Lunch",
  amount: 150,
  date: "2024-05-01",
};

describe("auth guard", () => {
  it.each([
    ["post", "/api/expenses"],
    ["put", "/api/expenses/1"],
    ["delete", "/api/expenses/1"],
  ] as const)("%s %s requires auth", async (method, url) => {
    const res = await request(app)[method](url).send(body);
    expect(res.status).toBe(401);
  });
});

describe("POST /api/expenses", () => {
  it("returns 400 on invalid input", async () => {
    const res = await request(app)
      .post("/api/expenses")
      .set("Cookie", authCookie())
      .send({ ...body, amount: "lots" });
    expect(res.status).toBe(400);
    expect(expenses.createExpense).not.toHaveBeenCalled();
  });

  it("creates an expense for the token's user", async () => {
    expenses.createExpense.mockResolvedValue({ id: 7, ...body } as any);
    const res = await request(app)
      .post("/api/expenses")
      .set("Cookie", authCookie())
      .send({ ...body, description: "" });
    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe(7);
    expect(expenses.createExpense).toHaveBeenCalledWith({
      userId: testUser.userId,
      category: "Food",
      description: null,
      amount: 150,
      date: "2024-05-01",
    });
  });
});

describe("PUT /api/expenses/:id", () => {
  it("returns 400 for a bad id", async () => {
    const res = await request(app)
      .put("/api/expenses/abc")
      .set("Cookie", authCookie())
      .send(body);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid expense ID");
  });

  it("returns 404 when not found", async () => {
    expenses.updateExpense.mockResolvedValue(undefined as any);
    const res = await request(app)
      .put("/api/expenses/7")
      .set("Cookie", authCookie())
      .send(body);
    expect(res.status).toBe(404);
  });

  it("updates the expense", async () => {
    expenses.updateExpense.mockResolvedValue({ id: 7, ...body } as any);
    const res = await request(app)
      .put("/api/expenses/7")
      .set("Cookie", authCookie())
      .send(body);
    expect(res.status).toBe(200);
    expect(expenses.updateExpense).toHaveBeenCalledWith({
      id: 7,
      userId: testUser.userId,
      ...body,
    });
  });
});

describe("DELETE /api/expenses/:id", () => {
  it("returns 400 for a bad id", async () => {
    const res = await request(app)
      .delete("/api/expenses/0")
      .set("Cookie", authCookie());
    expect(res.status).toBe(400);
  });

  it("returns 404 when not found", async () => {
    expenses.deleteExpense.mockResolvedValue(undefined as any);
    const res = await request(app)
      .delete("/api/expenses/7")
      .set("Cookie", authCookie());
    expect(res.status).toBe(404);
  });

  it("deletes the expense", async () => {
    expenses.deleteExpense.mockResolvedValue({ id: 7 } as any);
    const res = await request(app)
      .delete("/api/expenses/7")
      .set("Cookie", authCookie());
    expect(res.status).toBe(200);
    expect(expenses.deleteExpense).toHaveBeenCalledWith({
      id: 7,
      userId: testUser.userId,
    });
  });
});
