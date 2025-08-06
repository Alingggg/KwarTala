import { pool } from "@/config/index";
import type { User } from "@/types/index";

function formatUser(row: any): User | null {
  if (!row) return null;
  const { user_name, is_verified = false, ...rest } = row;
  return {
    ...rest,
    userName: user_name,
    isVerified: is_verified,
  };
}

const userRepository = {
  async create({ userName, email, password }: Omit<User, "id" | "isVerified">) {
    const { rows } = await pool.query(
      "INSERT INTO users (user_name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [userName, email, password]
    );
    return formatUser(rows[0]);
  },

  async findById(id: number) {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    return formatUser(rows[0]);
  },

  async findByEmail(email: string) {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return formatUser(rows[0]);
  },

  async updateCredentials({
    id,
    userName,
    email,
    password,
  }: Omit<User, "isVerified">) {
    const { rows } = await pool.query(
      "UPDATE users SET user_name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
      [userName, email, password, id]
    );
    return formatUser(rows[0]);
  },

  async updateVerificationStatus({
    id,
    isVerified,
  }: Pick<User, "id" | "isVerified">) {
    const { rows } = await pool.query(
      "UPDATE users SET is_verified = $1 WHERE id = $2 RETURNING *",
      [isVerified, id]
    );
    return formatUser(rows[0]);
  },

  async delete(id: number) {
    const { rowCount } = await pool.query("DELETE FROM users WHERE id = $1", [
      id,
    ]);
    return (rowCount ?? 0) > 0;
  },
};

export default userRepository;
