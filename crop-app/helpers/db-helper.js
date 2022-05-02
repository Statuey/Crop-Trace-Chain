import pool from "../config/db.js";

export async function connection() {
  return await pool.getConnection();
}
