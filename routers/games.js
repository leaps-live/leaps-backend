const express = require("express");
const router = express.Router();
const pool = require("../db");

// Create New Game
router.post("/new", async (req, res) => {
  try {
    const {
      gameName,
      gameDescription,
      teamA,
      teamB,
      leagueid,
      startTime,
      numberOfQuarters,
      minutesPerQuarter,
    } = req.body;

    let newGame = await pool.query(
      "INSERT INTO tbl_game (gameName, gameDescription, teamA, teamB, leagueid, startTime, numberOfQuarters, minutesPerQuarter, leaguename) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        gameName,
        gameDescription,
        teamA,
        teamB,
        leagueid,
        startTime,
        numberOfQuarters,
        minutesPerQuarter,
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
      gameName,
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
    } = req.body;

    const updateGame = await pool.query(
      "UPDATE tbl_league SET gameName = $1, gameDescription = $2, teamA = $3, teamB = $4, leagueid = $5, startTime = $6, teamA_score = $7, teamB_score = $8, isStart = $9, isEnd = $10, recordingurl = $11, numberOfQuarters = $12, minutesPerQuarter = $13 WHERE gameid = $14 RETURNING *",
      [
        gameName,
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
        gameid,
      ]
    );

    res.json(updateGame.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

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
