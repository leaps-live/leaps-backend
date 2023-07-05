const express = require("express");
const router = express.Router();
const pool = require("../db");

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

    res.json(newLeague.rows[0]);
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
      [userid]
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

// TODO: Add League Admin

// TODO: Delete Specific League Admin

module.exports = router;