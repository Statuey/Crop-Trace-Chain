import mysql from "mysql2/promise";
import config from "./config.js";

// 数据库连接池
const pool = mysql.createPool({
  connectionLimit: 15,
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password,
});

export default pool;
