const express = require("express");
const router = express.Router();
const pool = require("../db");

// Create New Game
router.post("/new", async (req, res) => {
  try {
    const {
      gameDescription,
      teamA,
      teamB,
      leagueid,
      startTime,
      numberOfQuarters,
      minutesPerQuarter,
      location,
      homeTeam,
      awayTeam,
      teamAName,
      teamBName,
    } = req.body;

    let newGame = await pool.query(
      "INSERT INTO tbl_game (gameDescription, teamA, teamB, leagueid, startTime, numberOfQuarters, minutesPerQuarter, location, homeTeam, awayTeam, teamAName, teamBName) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
      [
        gameDescription,
        teamA,
        teamB,
        leagueid,
        startTime,
        numberOfQuarters,
        minutesPerQuarter,
        location,
        homeTeam,
        awayTeam,
        teamAName,
        teamBName,
      ]
    );

    res.json(newGame.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//Delete a game by id
router.delete("/:gameid", async (req, res) => {
  try {
    const { gameid } = req.params;

    //check whether game exists
    const gameExists = await pool.query(
      "SELECT * FROM tbl_game WHERE gameid = $1",
      [gameid]
    );

    if (gameExists.rows.length === 0) {
      return res.status(401).json("Game does not exist...");
    }

    const deleteGame = await pool.query(
      "DELETE FROM tbl_game WHERE gameid = $1",
      [gameid]
    );

    res.json("Successfully Deleted the Game: " + gameid);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get Game Information by game id
router.get("/:gameid", async (req, res) => {
  try {
    const { gameid } = req.params;

    //check whether game exists
    const gameExists = await pool.query(
      "SELECT * FROM tbl_game WHERE gameid = $1",
      [gameid]
    );

    if (gameExists.rows.length === 0) {
      return res.status(401).json("Game does not exist...");
    }

    //get the Game info
    const getGameInfo = await pool.query(
      "SELECT * FROM tbl_game WHERE gameid = $1",
      [gameid]
    );

    res.json(getGameInfo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Edit Game information based off gameid
router.put("/:gameid", async (req, res) => {
  try {
    const { gameid } = req.params;
    const {
      gameDescription,
      teamA,
      teamB,
      leagueid,
      startTime,
      teamA_score,
      teamB_score,
      isStart,
      isEnd,
      recordingurl,
      numberOfQuarters,
      minutesPerQuarter,
      homeTeam,
      awayTeam,
      location,
    } = req.body;

    const updateGame = await pool.query(
      "UPDATE tbl_league SET gameDescription = $1, teamA = $2, teamB = $3, leagueid = $4, startTime = $5, teamA_score = $6, teamB_score = $7, isStart = $8, isEnd = $9, recordingurl = $10, numberOfQuarters = $11, minutesPerQuarter = $12, homeTeam = $13, awayTeam = $14, location = $15 WHERE gameid = $16 RETURNING *",
      [
        gameDescription,
        teamA,
        teamB,
        leagueid,
        startTime,
        teamA_score,
        teamB_score,
        isStart,
        isEnd,
        recordingurl,
        numberOfQuarters,
        minutesPerQuarter,
        homeTeam,
        awayTeam,
        location,
        gameid,
      ]
    );

    res.json(updateGame.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// TODO: need to fix this since these columns don't exist anymore in the table
router.post("/search/gamename", async (req, res) => {
  try {
    const { userInput } = req.body;

    let editedUserInput = "%" + userInput + "%";

    const searchGame = await pool.query(
      "SELECT * FROM tbl_game WHERE (gamename ilike $1) OR (teamaname ilike $1) OR (teambname ilike $1) OR (leaguename ilike $1)",
      [editedUserInput]
    );

    res.json(searchGame.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
