import { pool } from "#config";

const expenseRepository = {
  async create({ category, description, amount, date }) {
    const { rows } = await pool.query(
      "INSERT INTO expenses (category, description, amount, date) VALUES ($1, $2, $3, $4) RETURNING *",
      [category, description, amount, date]
    );
    return rows[0];
  },

  async findByDate(date) {
    const { rows } = await pool.query(
      "SELECT * FROM expenses WHERE date = $1",
      [date]
    );
    return rows;
  },

  async findByDateAndCategory(date, category) {
    const { rows } = await pool.query(
      "SELECT * FROM expenses WHERE date = $1 AND category = $2",
      [date, category]
    );
    return rows;
  },

  async update(id, { category, description, amount, date }) {
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
