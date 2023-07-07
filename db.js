const Pool = require("pg").Pool;
const pool = new Pool({
  user: "leaps",
  password: process.env.DATABASE_PASSWORD, // put this in env file
  database: "initial_leaps",
  host: process.env.DATABASE_HOST,
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
