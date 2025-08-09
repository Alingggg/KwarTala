import { Pool, types } from "pg";

types.setTypeParser(1700, (val: string) => parseFloat(val)); // Return NUMERIC as float instead of string

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

export default pool;
