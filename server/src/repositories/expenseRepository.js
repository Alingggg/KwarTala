import { pool } from "#config";

const expenseRepository = {
  async create({ userId, category, description, amount, date }) {
    const { rows } = await pool.query(
      "INSERT INTO expenses (user_id, category, description, amount, date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [userId, category, description, amount, date]
    );
    return rows[0];
  },

  async findByUserIdAndDateRange({ userId, startDate, endDate }) {
    const { rows } = await pool.query(
      "SELECT * FROM expenses WHERE date BETWEEN $1 AND $2 AND user_id = $3",
      [startDate, endDate, userId]
    );
    return rows;
  },

  async getTotalExpensesAmountByUserIdAndDateRange({
    userId,
    startDate,
    endDate,
  }) {
    const { rows } = await pool.query(
      "SELECT SUM(amount) AS total FROM expenses WHERE user_id = $1 AND date BETWEEN $2 AND $3",
      [userId, startDate, endDate]
    );
    return rows[0]?.total || 0;
  },

  async update({ id, category, description, amount, date }) {
    const { rows } = await pool.query(
      "UPDATE expenses SET category = $1, description = $2, amount = $3, date = $4 WHERE id = $5 RETURNING *",
      [category, description, amount, date, id]
    );
    return rows[0];
  },

  async delete(id) {
    const { rowCount } = await pool.query(
      "DELETE FROM expenses WHERE id = $1 RETURNING *",
      [id]
    );
    return rowCount > 0;
  },
};

export default expenseRepository;
