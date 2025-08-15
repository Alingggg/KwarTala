import db, { expenses } from "@/db/index";
import type { Expense } from "@/types/index";
import { and, between, desc, eq, sql, sum } from "drizzle-orm";

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
    startDate: Date;
    endDate: Date;
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
    const today = new Date();

    const startDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0,
      0
    );
    const endDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999
    );

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

  async getTotalSpentToday(userId: number) {
    const today = new Date();

    const startDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0,
      0
    );
    const endDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999
    );

    const [result] = await db
      .select({
        total: sql<number>`COALESCE(SUM(${expenses.amount}), 0)::float`.as(
          "total"
        ),
      })
      .from(expenses)
      .where(
        and(
          eq(expenses.userId, userId),
          between(expenses.date, startDate, endDate)
        )
      );

    return result.total;
  },

  async getTotalMonthlySpent({
    userId,
    startDate,
    endDate,
  }: {
    userId: number;
    startDate: Date;
    endDate: Date;
  }) {
    const [result] = await db
      .select({
        total: sql<number>`COALESCE(SUM(${expenses.amount}), 0)::float`.as(
          "total"
        ),
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
    startDate: Date;
    endDate: Date;
  }) {
    const { rows } = await db.execute(
      sql`WITH date_range AS (
         SELECT generate_series(${startDate}, ${endDate}, '1 day'::interval)::timestamptz AS date
       )
       SELECT dr.date, COALESCE(SUM(e.amount), 0) AS total
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
    startDate: Date;
    endDate: Date;
  }) {
    const { rows } = await db.execute(
      sql`WITH date_range AS (
         SELECT generate_series(${startDate}, ${endDate}, '1 week'::interval)::timestamptz AS week_start
       )
       SELECT dr.week_start AS date, COALESCE(SUM(e.amount), 0) AS total
       FROM date_range dr
       LEFT JOIN expenses e
         ON e.date >= dr.week_start
         AND e.date < LEAST(dr.week_start + '1 week'::interval, ${endDate}::timestamptz + INTERVAL '1 day')
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
    startDate: Date;
    endDate: Date;
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
    startDate: Date;
    endDate: Date;
  }) {
    return await db
      .select({ category: expenses.category, total: sum(expenses.amount) })
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
