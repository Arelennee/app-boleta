import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "admin123",
  database: "boleta_app",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// pool.connect(...) eliminado, no es necesario con mysql2/promise

export default pool;
