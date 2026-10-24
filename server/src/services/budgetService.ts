import db, { budgets } from "@/db/index";
import type { Budget } from "@/types/index";
import { and, eq } from "drizzle-orm";
import { format, lastDayOfMonth } from "date-fns";
import expenseService from "./expenseService";

const budgetService = {
  async createBudget({ userId, month, year, amount }: Omit<Budget, "id">) {
    const [budget] = await db
      .insert(budgets)
      .values({
        userId,
        month,
        year,
        amount: amount ?? 0,
      })
      .returning();

    return budget;
  },

  async findBudgetByUserIdAndDate({
    userId,
    month,
    year,
  }: Omit<Budget, "id" | "amount">) {
    const [budget] = await db
      .select()
      .from(budgets)
      .where(
        and(
          eq(budgets.userId, userId),
          eq(budgets.month, month),
          eq(budgets.year, year)
        )
      )
      .limit(1);

    return budget;
  },

  async getBudgetByUserIdAndDate({
    userId,
    month,
    year,
  }: Omit<Budget, "id" | "amount">) {
    let budget = await this.findBudgetByUserIdAndDate({ userId, month, year });

    if (!budget) {
      budget = await this.createBudget({
        userId,
        month,
        year,
        amount: 0,
      });
    }

    return budget;
  },

  async getCurrentMonthBudget(userId: number) {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const [budget] = await db
      .select()
      .from(budgets)
      .where(
        and(
          eq(budgets.userId, userId),
          eq(budgets.month, month),
          eq(budgets.year, year)
        )
      )
      .limit(1);

    return budget;
  },

  async updateBudgetByUserIdAndDate({
    userId,
    month,
    year,
    amount,
  }: Omit<Budget, "id">) {
    let [budget] = await db
      .update(budgets)
      .set({ amount })
      .where(
        and(
          eq(budgets.userId, userId),
          eq(budgets.month, month),
          eq(budgets.year, year)
        )
      )
      .returning();

    if (!budget) {
      budget = await this.createBudget({
        userId,
        month,
        year,
        amount,
      });
    }

    return budget;
  },

  async getBudgetStatus({
    userId,
    month,
    year,
  }: Omit<Budget, "id" | "amount">) {
    const monthStart = new Date(year, month - 1, 1);
    const budget = await this.findBudgetByUserIdAndDate({ userId, month, year });
    const spent = await expenseService.getTotalMonthlySpent({
      userId,
      startDate: format(monthStart, "yyyy-MM-dd"),
      endDate: format(lastDayOfMonth(monthStart), "yyyy-MM-dd"),
    });
    const amount = budget?.amount ?? 0;

    return {
      month,
      year,
      budget: amount,
      spent,
      remaining: amount - spent,
      usedPercentage:
        amount > 0 ? Math.round((spent / amount) * 100 * 100) / 100 : null,
    };
  },
};

export default budgetService;
