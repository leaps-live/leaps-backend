const express = require("express");
const router = express.Router();
const pool = require("../db");
const moment = require("moment");

//test for francis
router.post("/test", async (req, res) => {
  try {
    let num = req.body;

    res.json(num++);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//1. create a team with basic info
router.post("/create", async (req, res) => {
  try {
    const { teamCategories, teamName, teamDescription, teamCreator } = req.body;
    // const teamCreateDate = new Date().toLocaleString();
    const teamCreateDate = moment().format("YYYY-MM-DD"); // 2023-08-03T19:06:46-07:00

    //check the team name has been taken or not
    const checkTeamName = await pool.query(
      "SELECT * FROM tbl_team WHERE teamName = $1",
      [teamName]
    );

    if (checkTeamName.rows.length !== 0) {
      return res.status(401).json("This team name has already been taken...");
    }

    //create the new team
    const createTeam = await pool.query(
      "INSERT INTO tbl_team (teamCategories,teamName,teamDescription,teamCreator,teamCreateDate) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [teamCategories, teamName, teamDescription, teamCreator, teamCreateDate]
    );

    //get the teamid
    const teamid = await pool.query(
      "SELECT teamid FROM tbl_team WHERE teamName = $1",
      [teamName]
    );

    console.log("team id:", teamid.rows[0].teamid);

    //insert the first records into the tbl_team_players
    const createTeamPlayer = await pool.query(
      "INSERT INTO tbl_team_players (teamid, userid, isCreator) VALUES ($1, $2, $3) RETURNING *",
      [teamid.rows[0].teamid, teamCreator, true]
    );

    res.json(teamid.rows[0].teamid);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// edit team info
router.put("/update/:teamid", async (req, res) => {
  try {
    const { teamid } = req.params;
    const { teamName, teamDescription } = req.body;

    let oldName = await pool.query(
      "SELECT teamName FROM tbl_team WHERE teamid = $1",
      [teamid]
    );

    console.log(oldName.rows[0]);
    console.log(teamName);

    if (teamName === oldName.rows[0].teamname) {
      const updateTeamInfo = await pool.query(
        "UPDATE tbl_team SET teamDescription = $1 WHERE teamid = $2 RETURNING *",
        [teamDescription, teamid]
      );

      res.json(updateTeamInfo.rows[0]);
    }

    if (teamName !== oldName.rows[0].teamname) {
      //check whther the team name has already been taken
      const checkName = await pool.query(
        "SELECT * FROM tbl_team WHERE teamName = $1",
        [teamName]
      );

      if (checkName.rows.length !== 0) {
        return res.status(401).json("This team name has already been taken...");
      }

      //update new info
      if (checkName.rows.length === 0) {
        const updateTeamInfo = await pool.query(
          "UPDATE tbl_team SET teamName = $1, teamDescription = $2 WHERE teamid = $3 RETURNING *",
          [teamName, teamDescription, teamid]
        );

        res.json(updateTeamInfo.rows[0]);
      }
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//3. get teamname(leave for future)

//4. get teamid
router.get("/getid/:teamName", async (req, res) => {
  try {
    const { teamName } = req.params;

    const getTeamid = await pool.query(
      "SELECT teamId FROM tbl_team WHERE teamName = $1 RETURNING *",
      [teamName]
    );
    res.json(getTeamid.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//5. delete a team
//we need to go through all players in the bridge table
//and I do not know how to get it all done
//may take couple days
router.delete("/:teamid", async (req, res) => {
  try {
    const { teamid } = req.params;

    const deleteTeam = await pool.query(
      "DELETE FROM tbl_team WHERE teamid = $1 RETURNING *",
      [teamid]
    );

    res.json("Successfully action");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.post("/search/teamname", async (req, res) => {
  try {
    const { teamname } = req.body;

    let editedTeamName = "%" + teamname + "%";

    const searchTeam = await pool.query(
      "SELECT * FROM tbl_team WHERE teamname ilike $1",
      [editedTeamName]
    );

    res.json(searchTeam.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//get all team info
router.get("/get/:teamid", async (req, res) => {
  try {
    const {teamid} = req.params;

    const getAllInfo = await pool.query("SELECT * FROM tbl_team WHERE teamid = $1", [teamid]);

    res.json(getAllInfo.rows[0])
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});



// route to get all teams from a specific league
router.get("/all/:leagueid", async (req, res) => {
  try {
    const { leagueid } = req.params;

    const getAllTeams = await pool.query(
      "SELECT * FROM tbl_team JOIN tbl_team_league ON tbl_team.teamid = tbl_team_league.teamid WHERE tbl_team_league.leagueid = $1",
      [leagueid]
    );

    res.json(getAllTeams.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});


//based on the userid to get user's teams
router.get("/getTeam/:userid", async (req, res) => {
  try {
    const { userid } = req.params;

    const getAllTeam = await pool.query(
      "SELECT * FROM tbl_team_players WHERE userid = $1",
      [userid]
    );

    const teamIds = getAllTeam.rows.map((item) => item.teamid);

    const teamInfo = [];

    for (const teamid of teamIds) {
      const teaminfo = await pool.query(
        "SELECT * FROM tbl_team WHERE teamid = $1",
        [teamid]
      );
      teamInfo.push(teaminfo.rows);
    }

    res.json(teamInfo.flat());
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
