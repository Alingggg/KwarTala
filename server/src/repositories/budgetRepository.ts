import { pool } from "@/config/index";
import type { Budget } from "@/types/index";

function formatBudget(row: any): Budget | null {
  if (!row) return null;
  const { user_id, ...rest } = row;
  return { ...rest, userId: user_id };
}

const budgetRepository = {
  async create({ userId, month, year, amount }: Omit<Budget, "id">) {
    const { rows } = await pool.query(
      "INSERT INTO budgets (user_id, month, year, amount) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, month, year, amount]
    );
    return formatBudget(rows[0]);
  },

  async getByUserIdAndDate({
    userId,
    month,
    year,
  }: Pick<Budget, "userId" | "month" | "year">) {
    const { rows } = await pool.query(
      "SELECT * FROM budgets WHERE user_id = $1 AND month = $2 AND year = $3",
      [userId, month, year]
    );
    return formatBudget(rows[0]);
  },

  async updateByUserIdAndDate({
    userId,
    month,
    year,
    amount,
  }: Omit<Budget, "id">) {
    const { rows } = await pool.query(
      "UPDATE budgets SET amount = $1 WHERE user_id = $2 AND month = $3 AND year = $4 RETURNING *",
      [amount, userId, month, year]
    );
    return formatBudget(rows[0]);
  },
};

export default budgetRepository;
