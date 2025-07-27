import { pool } from "@/config";

function formatSession(row: any) {
  if (!row) return null;
  const { user_id, ...rest } = row;
  return { ...rest, userId: user_id };
}

const sessionRepository = {
  async create({
    userId,
    refreshToken,
  }: {
    userId: number;
    refreshToken: string;
  }) {
    const { rows } = await pool.query(
      "INSERT INTO sessions (user_id, refresh_token) VALUES ($1, $2) RETURNING *",
      [userId, refreshToken]
    );
    return formatSession(rows[0]);
  },

  async findByUserId(userId: number) {
    const { rows } = await pool.query(
      "SELECT * FROM sessions WHERE user_id = $1",
      [userId]
    );
    return formatSession(rows[0]);
  },

  async findByToken(refreshToken: string) {
    const { rows } = await pool.query(
      "SELECT * FROM sessions WHERE refresh_token = $1",
      [refreshToken]
    );
    return formatSession(rows[0]);
  },

  async deleteByUserId(userId: number) {
    const { rowCount } = await pool.query(
      "DELETE FROM sessions WHERE user_id = $1",
      [userId]
    );
    return (rowCount ?? 0) > 0;
  },

  async deleteByToken(refreshToken: string) {
    const { rowCount } = await pool.query(
      "DELETE FROM sessions WHERE refresh_token = $1",
      [refreshToken]
    );
    return (rowCount ?? 0) > 0;
  },
};

export default sessionRepository;
