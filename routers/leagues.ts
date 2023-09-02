import express from "express";
import { pool } from "../db";

const router = express.Router();

// Register New League
router.post("/register", async (req, res) => {
  try {
    const { leagueName, leagueDescription, leagueCategories, userId } =
      req.body;

    // check whether league name has already been registered
    const league = await pool.query(
      "SELECT * FROM tbl_league WHERE leagueName = $1",
      [leagueName]
    );

    if (league.rows.length !== 0) {
      return res.status(401).json("League has already existed...");
    }

    let newLeague = await pool.query(
      "INSERT INTO tbl_league (leagueName, leagueDescription, leagueCreator, leagueCategories) VALUES ($1, $2, $3, $4) RETURNING *",
      [leagueName, leagueDescription, userId, leagueCategories]
    );

    const defaultAdmin = await pool.query(
      "UPDATE tbl_league SET leagueAdmin = ARRAY_APPEND(leagueAdmin, $1) WHERE leagueName = $2 RETURNING *",
      [userId, leagueName]
    );

    res.json(defaultAdmin.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//Delete a league by id
router.delete("/:leagueid", async (req, res) => {
  try {
    const { leagueid } = req.params;

    //check whether league exist
    const League = await pool.query(
      "SELECT * FROM tbl_league WHERE leagueId = $1",
      [leagueid]
    );

    if (League.rows.length === 0) {
      return res.status(401).json("League does not exist...");
    }

    //if user exists, delete the user and return the email
    const deleteLeague = await pool.query(
      "DELETE FROM tbl_league WHERE leagueId = $1",
      [leagueid]
    );

    res.json("Successfully Delete the League: " + leagueid);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get League information by Leagueid
router.get("/:leagueid", async (req, res) => {
  try {
    const { leagueid } = req.params;

    //check whether the league exist
    const league = await pool.query(
      "SELECT * FROM tbl_league WHERE leagueId = $1",
      [leagueid]
    );

    if (league.rows.length === 0) {
      return res.status(401).json("League does not exist...");
    }

    //get the League info
    const getLeagueInfo = await pool.query(
      "SELECT * FROM tbl_league WHERE leagueId = $1",
      [leagueid]
    );

    res.json(getLeagueInfo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Edit League information based off leagueid
router.put("/:leagueid", async (req, res) => {
  try {
    const { leagueid } = req.params;
    const { leagueName, leagueDescription } = req.body;

    const updateLeagueNameDescription = await pool.query(
      "UPDATE tbl_league SET leagueName = $1, leagueDescription = $2 WHERE leagueId = $3 RETURNING *",
      [leagueName, leagueDescription, leagueid]
    );

    res.json(updateLeagueNameDescription.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//Add League Admin
router.put("/:leagueid/add/admin", async (req, res) => {
  try {
    const { leagueid } = req.params;
    const { userid } = req.body;

    const addAdmin = await pool.query(
      "UPDATE tbl_league SET leagueAdmin = ARRAY_APPEND(leagueAdmin, $1) WHERE leagueid= $2",
      [userid, leagueid]
    );

    res.json("Successfully add a new admin");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//Delete Specific League Admin
router.put("/:leagueid/delete/admin", async (req, res) => {
  try {
    const { leagueid } = req.params;
    const { userid } = req.body;

    //get all the leagueAdmin
    const getLeagueAdmin = await pool.query(
      "SELETE leagueAdmin FROM tbl_league WHERE leagueid = $1",
      [leagueid]
    );
    console.log(getLeagueAdmin.rows[0].leagueAdmin);

    //filter the leagueAdmin and delete the specific userid
    const newLeagueAdmin = getLeagueAdmin.rows[0].leagueAdmin.filter(
      (user) => JSON.parse(user).userid != userid
    );
    console.log(newLeagueAdmin);

    //insert the new leagueAdmin back to tbl_league
    const resultLeagueAdmin = await pool.query(
      "UPDATE tbl_league SET leagueAdmin = $1 WHERE leagueid = $2 RETURNING *",
      [newLeagueAdmin, leagueid]
    );

    res.json("Successfully delete the user from leagueAdmin");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//delete a league
router.delete("/:leagueid", async (req, res) => {
  try {
    const { leagueid } = req.params;

    const deleteLeague = await pool.query(
      "DELETE FROM tbl_league WHERE leagueid = $1",
      [leagueid]
    );

    res.json("Successfully deleted the league");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.post("/search/leaguename", async (req, res) => {
  try {
    const { leaguename } = req.body;

    let editedLeagueName = "%" + leaguename + "%";

    const searchLeague = await pool.query(
      "SELECT * FROM tbl_league WHERE leaguename ilike $1",
      [editedLeagueName]
    );

    res.json(searchLeague.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//get all league info
router.get("/get/:leagueid", async (req, res) => {
  try {
    const {leagueid} = req.params;

    const getAllInfo = await pool.query("SELECT * FROM tbl_league WHERE leagueid = $1", [leagueid]);

    res.json(getAllInfo.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
})

//get user's league from the team
router.get("/getLeague/:userid", async (req, res) => {
  try {
    const { userid } = req.params;

    const getAllTeam = await pool.query(
      "SELECT * FROM tbl_team_players WHERE userid = $1",
      [userid]
    );

    //use the return value from the get all team 
    const teamIds = getAllTeam.rows.map(item => item.teamid);
    //const leagueIds = [];
    const leagueInfo = [];

    for(const teamid of teamIds) {
      const leagueinfo = await pool.query(
        "SELECT * FROM tbl_league l \
      JOIN tbl_team_league tl ON l.leagueid = tl.leagueid  \
      WHERE tl.teamid = $1",
        [teamid]
      );
      leagueInfo.push(leagueinfo.rows);
    }

    //get all league info
    // for(const leagueid of leagueIds) {
    //   let leagueinfo = await pool.query("SELECT * FROM tbl_league WHERE leagueid = $1", l)
    // }

    res.json(leagueInfo);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
