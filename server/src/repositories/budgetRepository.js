import { pool } from "#config";

const budgetRepository = {
  async create({ month, year, amount }) {
    const { rows } = await pool.query(
      "INSERT INTO budgets (month, year, amount) VALUES ($1, $2, $3) RETURNING *",
      [month, year, amount]
    );
    return rows[0];
  },
  async findByMonth({ month, year }) {
    const { rows } = await pool.query(
      "SELECT * FROM budgets WHERE month = $1 AND year = $2",
      [month, year]
    );
    return rows[0];
  },
  async updateByMonth({ month, year, amount }) {
    const { rows } = await pool.query(
      "UPDATE budgets SET amount = $1 WHERE month = $2 AND year = $3 RETURNING *",
      [amount, month, year]
    );
    return rows[0];
  },
};

export default budgetRepository;
