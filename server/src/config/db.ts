import { Pool, types } from "pg";

types.setTypeParser(1700, (val: string) => parseFloat(val));
types.setTypeParser(1082, (val: string) => val);

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

export default pool;
