const express = require("express");
const router = express.Router();
const pool = require("../db");
const moment = require("moment");

// TODO: integrate into add team to league; check whether all players are a part of the league already when a team is joining a league;
router.get("/checkplayers/test/", async (req, res) => {
  try {
    const { leagueid, teamid, teamCategories } = req.body;

    const allPlayersFromTeam = await pool.query(
      "SELECT * FROM tbl_team_players WHERE teamid = $1",
      [teamid]
    );

    // Get all the userid for each player in the team
    const playerIds = allPlayersFromTeam.rows.map((item) => item.userid);

    for (const playerid of playerIds) {
      // Get all the teams for each player in the team
      const getThePlayerTeams = await pool.query(
        "SELECT * FROM tbl_team_players WHERE userid = $1",
        [playerid]
      );

      const allPlayerTeamIds = getThePlayerTeams.rows.map(
        (item) => item.teamid
      );

      // Check if any of the player's other teams are in the league
      for (const playerteamid of allPlayerTeamIds) {
        const checkIfPlayersOtherTeamIsInTheLeague = await pool.query(
          "SELECT * FROM tbl_team_league WHERE leagueid = $1 AND teamid = $2",
          [leagueid, playerteamid]
        );

        if (checkIfPlayersOtherTeamIsInTheLeague.rows.length > 0) {
          res.json(
            "This Player is already in another team within the league you're joining"
          );
        }
      }
    }

    // check if they are in the league already

    res.json(allPlayersFromTeam.rows[0]);
  } catch (err) {
    console.error(err);
  }
});

// team add request to a league
router.post("/request/add", async (req, res) => {
  try {
    const { leagueid, teamid, teamCategories } = req.body;
    const currentDate = moment().format("YYYY-MM-DD"); // Ex. 2023-08-03T19:06:46-07:00

    const addRequestLeagueTeam = await pool.query(
      "INSERT INTO tbl_team_league (teamid, leagueid, teamCategories, pendingApproval, timerequestedtojoin) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [teamid, leagueid, teamCategories, true, currentDate]
    );

    res.json(addRequestLeagueTeam.rows[0]);
  } catch (err) {
    console.error(err);
  }
});

// league creator/admin accepts team's request to join the league
// team add request to a league
router.put("/request/accept", async (req, res) => {
  try {
    const { leagueid, teamid, userid } = req.body;
    const currentDate = moment().format("YYYY-MM-DD"); // Ex. 2023-08-03T19:06:46-07:00

    // check if user's position is league admin
    const checkIfUserIsAdmin = await pool.query("");

    // check if user's position is league creator

    const updateRequestStatus = await pool.query(
      "UPDATE tbl_team_league SET pendingApproval = $1, timejoined = $2 WHERE teamid = $3 AND leagueid = $4 RETURNING *",
      [false, currentDate, teamid, leagueid]
    );

    res.json(updateRequestStatus.rows[0]);
  } catch (err) {
    console.error(err);
  }
});

// league creator/admin denies team's request to join the league

//add team to the league
router.post("/add", async (req, res) => {
  try {
    const { leagueid, teamid, teamCategories } = req.body;

    const currentDate = moment().format("YYYY-MM-DD"); // 2023-08-03T19:06:46-07:00

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

    // TODO: Check whether any of the players are already in another league within the team

    // TODO: Before adding team to the league, league admin must accept

    //add team to the league
    const addLeagueTeam = await pool.query(
      "INSERT INTO tbl_team_league (teamid, leagueid, teamCategories, timejoined) VALUES ($1, $2, $, $4) RETURNING *",
      [teamid, leagueid, teamCategorie, currentDate]
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

module.exports = router;
