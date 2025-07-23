import { pool } from "#config";

const budgetRepository = {
  async create({ date, amount }) {
    const { rows } = await pool.query(
      "INSERT INTO budgets (date, amount) VALUES ($1, $2) RETURNING *",
      [date, amount]
    );
    return rows[0];
  },
  async findByDate(date) {
    const { rows } = await pool.query("SELECT * FROM budgets WHERE date = $1", [
      date,
    ]);
    return rows[0];
  },
  async updateByDate({ date, amount }) {
    const { rows } = await pool.query(
      "UPDATE budgets SET amount = $1 WHERE date = $2 RETURNING *",
      [amount, date]
    );
    return rows[0];
  },
};

export default budgetRepository;
