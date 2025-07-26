import { pool } from "#config";

function formatUser(row) {
  if (!row) return null;
  const { first_name, last_name, ...rest } = row;
  return {
    ...rest,
    firstName: first_name,
    lastName: last_name,
  };
}

const userRepository = {
  async create({ firstName, lastName, email, password }) {
    const { rows } = await pool.query(
      "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [firstName, lastName, email, password]
    );
    return formatUser(rows[0]);
  },

  async findById(id) {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    return formatUser(rows[0]);
  },

  async findByEmail(email) {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return formatUser(rows[0]);
  },

  async update(id, { firstName, lastName, email, password }) {
    const { rows } = await pool.query(
      "UPDATE users SET first_name = $1, last_name = $2, email = $3, password = $4 WHERE id = $5 RETURNING *",
      [firstName, lastName, email, password, id]
    );
    return formatUser(rows[0]);
  },

  async delete(id) {
    const { rowCount } = await pool.query("DELETE FROM users WHERE id = $1", [
      id,
    ]);
    return rowCount > 0;
  },
};

export default userRepository;
