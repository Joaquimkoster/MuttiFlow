const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "muttiflow",
  password: process.env.PGPASSWORD || "123456",
  port: Number(process.env.PGPORT || 5432),
});

module.exports = pool;
