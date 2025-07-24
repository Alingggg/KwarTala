import { pool } from "#config";

const sessionRepository = {
  async create({ userId, refreshToken }) {
    const { rows } = await pool.query(
      "INSERT INTO sessions (user_id, refresh_token) VALUES ($1, $2) RETURNING *",
      [userId, refreshToken]
    );
    return rows[0];
  },

  async findByUserId(userId) {
    const { rows } = await pool.query(
      "SELECT * FROM sessions WHERE user_id = $1",
      [userId]
    );
    return rows[0];
  },

  async findByToken(refreshToken) {
    const { rows } = await pool.query(
      "SELECT * FROM sessions WHERE refresh_token = $1",
      [refreshToken]
    );
    return rows[0];
  },

  async deleteByUserId(userId) {
    const { rowCount } = await pool.query(
      "DELETE FROM sessions WHERE user_id = $1",
      [userId]
    );
    return rowCount > 0;
  },

  async deleteByToken(refreshToken) {
    const { rowCount } = await pool.query(
      "DELETE FROM sessions WHERE refresh_token = $1",
      [refreshToken]
    );
    return rowCount > 0;
  },
};

export default sessionRepository;
