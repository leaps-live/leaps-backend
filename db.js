const Pool = require("pg").Pool;
const pool = new Pool({
  user: "leaps",
  password: "leaps52820231747", // put this in env file
  database: "initial_leaps",
  host: "leaps-db-instance.ckw3zjvtld3t.us-west-1.rds.amazonaws.com",
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
