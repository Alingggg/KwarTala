import { pool } from "@/config/index";
import type { User } from "@/types/index";

function formatUser(row: any): User | null {
  if (!row) return null;
  const {
    user_name,
    username_changed_at,
    email_changed_at,
    password_changed_at,
    is_verified = false,
    ...rest
  } = row;
  return {
    ...rest,
    userName: user_name,
    isVerified: is_verified,
    userNameChangedAt: username_changed_at,
    emailChangedAt: email_changed_at,
    passwordChangedAt: password_changed_at,
  };
}

const userRepository = {
  async create({
    userName,
    email,
    password,
  }: Pick<User, "userName" | "email" | "password">) {
    const { rows } = await pool.query(
      "INSERT INTO users (user_name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [userName, email, password]
    );
    return formatUser(rows[0]);
  },

  async getById(id: number) {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    return formatUser(rows[0]);
  },

  async getByEmail(email: string) {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
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

  async updateUserName({ id, userName }: Pick<User, "id" | "userName">) {
    const changeAt = new Date();
    const { rows } = await pool.query(
      "UPDATE users SET user_name = $1, username_changed_at = $2 WHERE id = $3 RETURNING *",
      [userName, changeAt, id]
    );
    return formatUser(rows[0]);
  },

  async updateEmail({ id, email }: Pick<User, "id" | "email">) {
    const changedAt = new Date();
    const { rows } = await pool.query(
      "UPDATE users SET email = $1, email_changed_at = $2 WHERE id = $3 RETURNING *",
      [email, changedAt, id]
    );
    return formatUser(rows[0]);
  },

  async updatePassword({ id, password }: Pick<User, "id" | "password">) {
    const changedAt = new Date();
    const { rows } = await pool.query(
      "UPDATE users SET password = $1, password_changed_at = $2 WHERE id = $3 RETURNING *",
      [password, changedAt, id]
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
