import { describe, expect, it, vi } from "vitest";
import request from "supertest";
import app from "@/app";
import { dashboardService } from "@/services/index";
import { authCookie, testUser } from "../helpers";

const dashboard = vi.mocked(dashboardService);

const periodEndpoints = [
  ["/api/dashboard/charts/daily", "getDailyChartData"],
  ["/api/dashboard/charts/weekly", "getWeeklyChartData"],
  ["/api/dashboard/transactions/summary", "getTransactionsSummary"],
  ["/api/dashboard/analytics", "getAnalyticsData"],
] as const;

const transactionsQuery =
  "startDate=2024-01-01&endDate=2024-01-31&page=1&limit=10&orderBy=desc";

describe("auth guard", () => {
  it.each([
    "/api/dashboard/home",
    ...periodEndpoints.map(([url]) => url),
    "/api/dashboard/transactions",
  ])("GET %s requires auth", async (url) => {
    const res = await request(app).get(url);
    expect(res.status).toBe(401);
  });
});

describe("GET /api/dashboard/home", () => {
  it("returns home data", async () => {
    dashboard.getHomeData.mockResolvedValue({ totalSpentToday: 10 } as any);
    const res = await request(app)
      .get("/api/dashboard/home")
      .set("Cookie", authCookie());
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({ totalSpentToday: 10 });
    expect(dashboard.getHomeData).toHaveBeenCalledWith(testUser.userId);
  });
});

describe.each(periodEndpoints)("GET %s", (url, method) => {
  it("returns 400 for an invalid period", async () => {
    const res = await request(app)
      .get(`${url}?month=0&year=2024`)
      .set("Cookie", authCookie());
    expect(res.status).toBe(400);
    expect(dashboard[method]).not.toHaveBeenCalled();
  });

  it("returns data for a valid period", async () => {
    dashboard[method].mockResolvedValue([{ value: 1 }] as any);
    const res = await request(app)
      .get(`${url}?month=2&year=2024`)
      .set("Cookie", authCookie());
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([{ value: 1 }]);
    expect(dashboard[method]).toHaveBeenCalledWith({
      userId: testUser.userId,
      month: 2,
      year: 2024,
    });
  });
});

describe("GET /api/dashboard/transactions", () => {
  it.each([
    "startDate=2024-01-01&endDate=2024-01-31&page=0&limit=10&orderBy=desc",
    "startDate=01-01-2024&endDate=2024-01-31&page=1&limit=10&orderBy=desc",
    "startDate=2024-01-01&endDate=2024-01-31&page=1&limit=10&orderBy=up",
    "startDate=2024-01-01&endDate=2024-01-31&orderBy=desc",
  ])("returns 400 for %s", async (query) => {
    const res = await request(app)
      .get(`/api/dashboard/transactions?${query}`)
      .set("Cookie", authCookie());
    expect(res.status).toBe(400);
  });

  it("returns 404 when the service finds nothing", async () => {
    dashboard.getTransactions.mockResolvedValue(null as any);
    const res = await request(app)
      .get(`/api/dashboard/transactions?${transactionsQuery}`)
      .set("Cookie", authCookie());
    expect(res.status).toBe(404);
  });

  it("returns transactions unwrapped", async () => {
    const payload = { data: [{ id: 1 }], total: 1 };
    dashboard.getTransactions.mockResolvedValue(payload as any);
    const res = await request(app)
      .get(`/api/dashboard/transactions?${transactionsQuery}`)
      .set("Cookie", authCookie());
    expect(res.status).toBe(200);
    expect(res.body).toEqual(payload);
    expect(dashboard.getTransactions).toHaveBeenCalledWith({
      userId: testUser.userId,
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      page: 1,
      limit: 10,
      orderBy: "desc",
    });
  });
});
