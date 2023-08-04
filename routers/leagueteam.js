const express = require("express");
const router = express.Router();
const pool = require("../db");

//7/24
//add team to the league
router.post("/add", async (req, res) => {
  try {
    const { leagueid, teamid, teamCategories } = req.body;

    //check whether this team has already joined
    const checkTeam = await pool.query(
      "SELECT * FROM tbl_team_league WHERE teamid = $1 AND leagueid = $2",
      [teamid, leagueid]
    );

    if (checkTeam.rows.length !== 0) {
      return res
        .status(401)
        .json("This team has already joined this league...");
    }

    //add team to the league
    const addLeagueTeam = await pool.query(
      "INSERT INTO tbl_team_league (teamid, leagueid, teamCategories) VALUES ($1, $2, $3) RETURNING *",
      [teamid, leagueid, teamCategories]
    );

    res.json(addLeagueTeam.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//delete the team from league
router.delete("/delete", async (req, res) => {
  try {
    const { teamid, leagueid } = req.body;

    const kickOutTeam = await pool.query(
      "DELETE FROM tbl_team_league WHERE teamid = $1 AND leagueid = $2",
      [teamid, leagueid]
    );

    res.json("Successfully kick out this team...");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//edit team category

//get all the team from the league

// router.get("/:leagueid", async (req, res) => {
//   try {
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

module.exports = router;
