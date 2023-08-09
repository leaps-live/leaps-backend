const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/all", async (req, res) => {
  try {
    const { userinput } = req.body;

    let editedUserInput = "%" + userinput + "%";
    let combinedOutput = {};

    const searchTeam = await pool.query(
      "SELECT * FROM tbl_team WHERE teamname ilike $1",
      [editedUserInput]
    );

    const searchUser = await pool.query(
      "SELECT * FROM tbl_user WHERE (userFirstName ilike $1) OR (userLastName ilike $1) OR (username like $1)",
      [editedUserInput]
    );

    const searchLeague = await pool.query(
      "SELECT * FROM tbl_league WHERE leaguename ilike $1",
      [editedUserInput]
    );

    combinedOutput.teams = searchTeam.rows;
    combinedOutput.users = searchUser.rows;
    combinedOutput.leagues = searchLeague.rows;

    console.log("combinedOutput", combinedOutput);

    res.json(combinedOutput);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
