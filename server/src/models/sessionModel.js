import { pool } from "#config";

const sessionModel = {
  async createSession({ userId, refreshToken }) {
    const { rows } = await pool.query(
      "INSERT INTO sessions (user_id, refresh_token) VALUES ($1, $2) RETURNING *",
      [userId, refreshToken]
    );
    return rows[0];
  },

  async getSessionByUserId(userId) {
    const { rows } = await pool.query(
      "SELECT * FROM sessions WHERE user_id = $1",
      [userId]
    );
    return rows[0];
  },

  async getSessionByToken(refreshToken) {
    const { rows } = await pool.query(
      "SELECT * FROM sessions WHERE refresh_token = $1",
      [refreshToken]
    );
    return rows[0];
  },

  async deleteSessionByUserId(userId) {
    const { rowCount } = await pool.query(
      "DELETE FROM sessions WHERE user_id = $1",
      [userId]
    );
    return rowCount > 0;
  },

  async deleteSessionByToken(refreshToken) {
    const { rowCount } = await pool.query(
      "DELETE FROM sessions WHERE refresh_token = $1",
      [refreshToken]
    );
    return rowCount > 0;
  },
};

export default sessionModel;
