const express = require("express");
const path = require("path"); //ms azure

const app = express();

// put this in db.js file
const Pool = require("pg").Pool;
const pool = new Pool({
  user: "leaps",
  password: "leaps52820231747", // put this in env file
  database: "initial_leaps",
  host: "leaps-db-instance.ckw3zjvtld3t.us-west-1.rds.amazonaws.com",
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

const cors = require("cors");

app.use(cors());

pool
  .connect()
  .then(() => console.log("Connected to PostgreSQL database"))
  .catch((err) =>
    console.error("Error connecting to PostgreSQL database", err)
  );

app.use(express.json());

app.use("/users", require("./routers/users"));
app.use("/leagues", require("./routers/leagues"));
app.use("/game", require("./routers/games"));

app.listen(8080, () => console.log("Server listening on port 8080"));
