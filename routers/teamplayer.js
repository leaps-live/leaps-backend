const express = require("express");
const router = express.Router();
const pool = require("../db");

//1.when a team is create
//the creator automatically become the first player
//and his role is captain
//-->done in the team route

//2.add team player
router.post("/add", async (req, res) => {
  try {
    const { teamid, userid } = req.body;

    //check whether this team exist
    //save for future
    const checkTeam = await pool.query(
      "SELECT * FROM tbl_team WHERE teamid = $1",
      [teamid]
    );

    if (checkTeam.rows.length === 0) {
      return res.status(401).json("This team does not exist");
    }

    //check whether this player has already in this team
    const checkPlayer = await pool.query(
      "SELECT * FROM tbl_team_players WHERE teamid = $1 AND userid = $2",
      [teamid, userid]
    );

    if (checkPlayer.rows.length !== 0) {
      return res.status(401).json("This player is already in this team...");
    }

    const addPlayer = await pool.query(
      "INSERT INTO tbl_team_players (teamid, userid) VALUES ($1, $2) RETURNING *",
      [teamid, userid]
    );

    res.json(addPlayer.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//3. delete a team player
router.delete("/delete", async (req, res) => {
  try {
    const { teamid, userid } = req.body;

    //if the user deleted is the captain
    //auto transfer to a random play in this team
    const randomPlayer = await pool.query(
      "SELECT userid \
    FROM ( \
        SELECT userid \
        FROM tbl_team_players \
        WHERE teamid = $1 \
    ) AS subquery \
    ORDER BY RANDOM() \
    LIMIT 1; ",
      [teamid]
    );

    //male this player captain
    const newCaptain = await pool.query(
      "SET userRole = $1 FROM tbl_team_players WHERE teamid = $1 AND userid = $2",
      [TRUE, teamid, randomPlayer]
    );

    //delete a player from a team
    const deletePlayer = await pool.query(
      "DELETE FROM tbl_team_players WHERE teamid = $1 AND userid = $2",
      [teamid, userid]
    );

    res.json("Successfully delete action");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//4. captain transfer
router.put("/:teamid/transfer", async (req, res) => {
  try {
    const { userid1, userid2 } = req.body;
    const { teamid } = req.params;

    const cancelOldCaptain = await pool.query(
      "SET userRole = $1 FROM tbl_team_players WHERE teamid = $2 AND userid = $3",
      [FALSE, teamid, userid1]
    );

    const transferNewCaptain = await pool.query(
      "SET userRole = $1 FROM tbl_team_players WHERE teamid = $2 AND userid = $3",
      [TRUE, teamid, userid2]
    );

    res.json("New captain is set");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;