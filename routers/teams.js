const express = require("express");
const router = express.Router();
const pool = require("../db");

//test for francis
router.post("/test", async (req, res) => {
  try {
      let num = req.body;

      res.json(num++);
  } catch(error) { 
    console.error(error.message);
    res.status(500).send("Server Error");
  }
})

//1. create a team with basic info
router.post("/create", async (req, res) => {
  try {
    const { teamCategories, teamName, teamDescription, teamCreator } = req.body;
    const teamCreateDate = new Date().toLocaleString();

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
      "INSERT INTO tbl_team (teamCategories,teamName,teamDescription,teamCreator,teamCreateDate) VALUES ($1, $2, $3, $4, $5）RETURNING *",
      [teamCategories, teamName, teamDescription, teamCreator, teamCreateDate]
    );

    //get the teamid
    const teamid = await pool.query(
      "SELECT teamid FROM tbl_team WHERE teamName = $1",
      [teamName]
    );

    //insert the first records into the tbl_team_players
    const createTeamPlayer = await pool.query(
      "INSERT INTO tbl_team_players (teamid, userid, userRole) VALUES ($1, $2, $3) RETURNING *",
      [teamid, teamCreator, true]
    );

    res.json("Successfully create a new team");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//2. update team regular info
router.put("/:teamid/update", async (req, res) => {
  try {
    const { teamid } = req.params;
    const { teamName, teamDescription } = req.body;

    //check whther the team name has already been taken
    const checkName = await pool.query(
      "SELECT teamId FROM tbl_team WHERE teamName = $1",
      [teamName]
    );

    if (checkName.rows[0] !== teamid) {
      return res.status(401).json("This team name has already been taken...");
    }

    //update new info
    const updateTeamInfo = await pool.query(
      "UPDATE tbl_team SET teamName = $1, teamDescription = $2 RETURNING *",
      [teamName, teamDescription]
    );

    res.json(updateTeamInfo.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//3. get teamname(leave for future)

//4. get teamid
router.get("/", async (req, res) => {
  try {
    const { teamName } = req.body;

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

    const deleteTeam = pool.query(
      "DELETE FROM tbl_team WHERE teamid = $1 RETURNING *",
      [teamid]
    );

    res.json("Successfully action");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;