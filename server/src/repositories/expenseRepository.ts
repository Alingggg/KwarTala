import { pool } from "@/config/index";
import type { Expense } from "@/types/index";

function formatExpense(row: any): Expense | null {
  if (!row) return null;
  const { user_id, ...rest } = row;
  return { ...rest, userId: user_id };
}

const expenseRepository = {
  async create({
    userId,
    category,
    description,
    amount,
    date,
  }: Omit<Expense, "id">) {
    const { rows } = await pool.query(
      "INSERT INTO expenses (user_id, category, description, amount, date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [userId, category, description, amount, date]
    );
    return formatExpense(rows[0]);
  },

  async getByUserIdAndDateRange({
    userId,
    startDate,
    endDate,
  }: {
    userId: number;
    startDate: Date | string;
    endDate: Date | string;
  }) {
    const { rows } = await pool.query(
      "SELECT * FROM expenses WHERE date BETWEEN $1 AND $2 AND user_id = $3",
      [startDate, endDate, userId]
    );
    return rows.map(formatExpense);
  },

  async getTotalExpensesAmountByUserIdAndDateRange({
    userId,
    startDate,
    endDate,
  }: {
    userId: number;
    startDate: Date | string;
    endDate: Date | string;
  }) {
    const { rows } = await pool.query(
      "SELECT SUM(amount) AS total FROM expenses WHERE user_id = $1 AND date BETWEEN $2 AND $3",
      [userId, startDate, endDate]
    );
    return rows[0]?.total || 0;
  },

  async getTotalDailyExpensesByUserIdAndDateRange({
    userId,
    startDate,
    endDate,
  }: {
    userId: number;
    startDate: Date | string;
    endDate: Date | string;
  }) {
    const { rows } = await pool.query(
      `WITH date_range AS (
         SELECT generate_series($1, $2, '1 day'::interval)::timestamptz AS date
       )
       SELECT dr.date, COALESCE(SUM(e.amount), 0) AS total
       FROM date_range dr
       LEFT JOIN expenses e ON dr.date = e.date AND e.user_id = $3
       GROUP BY dr.date
       ORDER BY dr.date`,
      [startDate, endDate, userId]
    );

    return rows;
  },

  async getTotalWeeklyExpensesByUserIdAndDateRange({
    userId,
    startDate,
    endDate,
  }: {
    userId: number;
    startDate: Date | string;
    endDate: Date | string;
  }) {
    const { rows } = await pool.query(
      `WITH date_range AS (
         SELECT generate_series($1, $2, '1 week'::interval)::timestamptz AS week_start
       )
       SELECT dr.week_start AS date, COALESCE(SUM(e.amount), 0) AS total
       FROM date_range dr
       LEFT JOIN expenses e
         ON e.date >= dr.week_start
         AND e.date < LEAST(dr.week_start + '1 week'::interval, $2::timestamptz + INTERVAL '1 day')
         AND e.user_id = $3
       GROUP BY dr.week_start
       ORDER BY dr.week_start`,
      [startDate, endDate, userId]
    );

    return rows;
  },

  async getTotalSpentPerCategory({
    userId,
    startDate,
    endDate,
  }: {
    userId: number;
    startDate: Date | string;
    endDate: Date | string;
  }) {
    const { rows } = await pool.query(
      `SELECT category, SUM(amount) AS total
      FROM expenses
      WHERE user_id = $1 AND date BETWEEN $2 AND $3
      GROUP BY category`,
      [userId, startDate, endDate]
    );
    return rows;
  },

  async getHighestExpensesByUserIdAndDateRange({
    userId,
    startDate,
    endDate,
    limit,
  }: {
    userId: number;
    startDate: Date | string;
    endDate: Date | string;
    limit: number;
  }) {
    const { rows } = await pool.query(
      `SELECT * FROM expenses
      WHERE user_id = $1 AND date BETWEEN $2 AND $3
      ORDER BY amount DESC
      LIMIT $4`,
      [userId, startDate, endDate, limit]
    );
    return rows.map(formatExpense);
  },

  async update({
    id,
    category,
    description,
    amount,
    date,
  }: Omit<Expense, "userId">) {
    const { rows } = await pool.query(
      "UPDATE expenses SET category = $1, description = $2, amount = $3, date = $4 WHERE id = $5 RETURNING *",
      [category, description, amount, date, id]
    );
    return formatExpense(rows[0]);
  },

  async delete(id: number) {
    const { rowCount } = await pool.query(
      "DELETE FROM expenses WHERE id = $1 RETURNING *",
      [id]
    );
    return (rowCount ?? 0) > 0;
  },
};

export default expenseRepository;
