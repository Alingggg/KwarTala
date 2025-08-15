import db, { expenses } from "@/db/index";
import type { Expense } from "@/types/index";
import { and, between, desc, eq, sql, sum } from "drizzle-orm";
import { format } from "date-fns";

const expenseService = {
  async createExpense({
    userId,
    category,
    description,
    amount,
    date,
  }: Omit<Expense, "id">) {
    const [expense] = await db
      .insert(expenses)
      .values({
        userId,
        category,
        description,
        amount,
        date,
      })
      .returning();

    return expense;
  },

  async getExpensesByUserIdAndDateRange({
    userId,
    startDate,
    endDate,
  }: {
    userId: number;
    startDate: string;
    endDate: string;
  }) {
    return db
      .select()
      .from(expenses)
      .where(
        and(
          eq(expenses.userId, userId),
          between(expenses.date, startDate, endDate)
        )
      );
  },

  async getTodaysTransactions(userId: number) {
    const today = format(new Date(), "yyyy-MM-dd");

    return db
      .select()
      .from(expenses)
      .where(and(eq(expenses.userId, userId), eq(expenses.date, today)));
  },

  async getTotalSpentToday(userId: number) {
    const today = format(new Date(), "yyyy-MM-dd");

    const [result] = await db
      .select({
        total: sql<number>`COALESCE(SUM(${expenses.amount}), 0)::float`,
      })
      .from(expenses)
      .where(and(eq(expenses.userId, userId), eq(expenses.date, today)));

    return result.total ?? 0;
  },

  async getTotalMonthlySpent({
    userId,
    startDate,
    endDate,
  }: {
    userId: number;
    startDate: string;
    endDate: string;
  }) {
    const [result] = await db
      .select({
        total: sql<number>`COALESCE(SUM(${expenses.amount}), 0)::float`,
      })
      .from(expenses)
      .where(
        and(
          eq(expenses.userId, userId),
          between(expenses.date, startDate, endDate)
        )
      );

    return result?.total ?? 0;
  },

  async getTotalDailyExpenseInDateRange({
    userId,
    startDate,
    endDate,
  }: {
    userId: number;
    startDate: string;
    endDate: string;
  }) {
    const { rows } = await db.execute(
      sql`WITH date_range AS (
         SELECT generate_series(${startDate}, ${endDate}, INTERVAL '1 day')::date AS date
       )
       SELECT dr.date, COALESCE(SUM(e.amount), 0)::float AS total
       FROM date_range dr
       LEFT JOIN expenses e ON dr.date = e.date AND e.user_id = ${userId}
       GROUP BY dr.date
       ORDER BY dr.date`
    );

    return rows;
  },

  async getTotalWeeklyExpenseInDateRange({
    userId,
    startDate,
    endDate,
  }: {
    userId: number;
    startDate: string;
    endDate: string;
  }) {
    const { rows } = await db.execute(
      sql`WITH date_range AS (
         SELECT generate_series(${startDate}, ${endDate}, INTERVAL '1 week')::date AS week_start
       )
       SELECT dr.week_start AS date, COALESCE(SUM(e.amount), 0)::float AS total
       FROM date_range dr
       LEFT JOIN expenses e
         ON e.date >= dr.week_start
         AND e.date < LEAST(dr.week_start + INTERVAL '1 week', ${endDate}::date + INTERVAL '1 day')
         AND e.user_id = ${userId}
       GROUP BY dr.week_start
       ORDER BY dr.week_start`
    );

    return rows;
  },

  async getHighestExpenses({
    userId,
    startDate,
    endDate,
    limit,
  }: {
    userId: number;
    startDate: string;
    endDate: string;
    limit: number;
  }) {
    return await db
      .select()
      .from(expenses)
      .where(
        and(
          eq(expenses.userId, userId),
          between(expenses.date, startDate, endDate)
        )
      )
      .limit(limit)
      .orderBy(desc(expenses.amount));
  },

  async getTotalSpentPerCategory({
    userId,
    startDate,
    endDate,
  }: {
    userId: number;
    startDate: string;
    endDate: string;
  }) {
    return await db
      .select({
        category: expenses.category,
        total: sql<number>`COALESCE(SUM(${expenses.amount}), 0)::float`,
      })
      .from(expenses)
      .where(
        and(
          eq(expenses.userId, userId),
          between(expenses.date, startDate, endDate)
        )
      )
      .groupBy(expenses.category);
  },

  async updateExpense({
    id,
    category,
    description,
    amount,
    date,
  }: Omit<Expense, "userId">) {
    const [expense] = await db
      .update(expenses)
      .set({
        category,
        description,
        amount,
        date,
      })
      .where(eq(expenses.id, id))
      .returning();

    return expense;
  },

  async deleteExpense(id: number) {
    const [expense] = await db
      .delete(expenses)
      .where(eq(expenses.id, id))
      .returning();

    return expense;
  },
};

export default expenseService;
