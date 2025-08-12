import { pool } from "@/config/index";

function formatVerificationToken(row: any) {
  if (!row) return null;
  const { user_id, expires_at, ...rest } = row;
  return {
    ...rest,
    userId: user_id,
    expiresAt: expires_at,
  };
}

const verificationTokenRepository = {
  async create({
    userId,
    token,
    expiresAt,
  }: {
    userId: number;
    token: string;
    expiresAt: Date;
  }) {
    const { rows } = await pool.query(
      "INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES ($1, $2, $3) RETURNING *",
      [userId, token, expiresAt]
    );
    return formatVerificationToken(rows[0]);
  },

  async getByToken(token: string) {
    const { rows } = await pool.query(
      "SELECT * FROM email_verification_tokens WHERE token = $1",
      [token]
    );
    return formatVerificationToken(rows[0]);
  },

  async deleteByToken(token: string) {
    const { rowCount } = await pool.query(
      "DELETE FROM email_verification_tokens WHERE token = $1",
      [token]
    );
    return (rowCount ?? 0) > 0;
  },
};

export default verificationTokenRepository;
