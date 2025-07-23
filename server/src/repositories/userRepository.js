import { pool } from "#config";

const userRepository = {
  async create({ firstName, lastName, email, password }) {
    const { rows } = await pool.query(
      'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING first_name AS "firstName", last_name AS "lastName", email',
      [firstName, lastName, email, password]
    );
    return rows[0];
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT id, first_name AS "firstName", last_name AS "lastName", email FROM users WHERE id = $1',
      [id]
    );
    return rows[0];
  },

  async findByEmail(email) {
    const { rows } = await pool.query(
      'SELECT id, first_name AS "firstName", last_name AS "lastName", email, password FROM users WHERE email = $1',
      [email]
    );
    return rows[0];
  },

  async update(id, { firstName, lastName, email }) {
    const { rows } = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE id = $4 RETURNING id, first_name AS "firstName", last_name AS "lastName", email',
      [firstName, lastName, email, id]
    );
    return rows[0];
  },

  async delete(id) {
    const { rowCount } = await pool.query("DELETE FROM users WHERE id = $1", [
      id,
    ]);
    return rowCount > 0;
  },
};

export default userRepository;
