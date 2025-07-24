import { pool } from "#config";

const budgetRepository = {
  async create({ month, year, amount }) {
    const { rows } = await pool.query(
      "INSERT INTO budgets (month, year, amount) VALUES ($1, $2, $3) RETURNING *",
      [month, year, amount]
    );
    return rows[0];
  },
  async findByUserIdAndDate({ userId, month, year }) {
    const { rows } = await pool.query(
      "SELECT * FROM budgets WHERE user_id = $1 AND month = $2 AND year = $3",
      [userId, month, year]
    );
    return rows[0];
  },
  async updateByUserIdAndDate({ userId, month, year, amount }) {
    const { rows } = await pool.query(
      "UPDATE budgets SET amount = $1 WHERE user_id = $2 AND month = $3 AND year = $4 RETURNING *",
      [amount, userId, month, year]
    );
    return rows[0];
  },
};

export default budgetRepository;
