const express = require("express");
const path = require("path");

require("dotenv").config();

const app = express();

// put this in db.js file
const Pool = require("pg").Pool;
const pool = new Pool({
  user: "leaps",
  password: process.env.DATABASE_PASSWORD, // put this in env file
  database: "initial_leaps",
  host: process.env.DATABASE_HOST,
  port: 5432,
  //ssl: { rejectUnauthorized: false },
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
app.use("/leagueteam", require("./routers/leagueteam"));
app.use("/game", require("./routers/games"));
app.use("/team", require("./routers/teams"));
app.use("/teamplayer", require("./routers/teamplayer"));

app.listen(8080, () => console.log("Server listening on port 8080"));
