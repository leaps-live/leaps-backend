const express = require("express");
const router = express.Router();
const pool = require("../db");

// Register New User
router.post("/register", async (req, res) => {
  try {
    const {
      userFirstName,
      userLastName,
      username,
      userEmail,
      userPassword,
      userBirthday,
      userHeight,
      userWeight,
    } = req.body;

    // check whether useremail has already been registered
    const user = await pool.query(
      "SELECT * FROM tbl_user WHERE userEmail = $1",
      [userEmail]
    );

    if (user.rows.length !== 0) {
      return res.status(401).json("User has already existed...");
    }

    let newUser = await pool.query(
      "INSERT INTO tbl_user (userFirstName, userLastName, username, userEmail, userPassword, userBirthday, userHeight, userWeight) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        userFirstName,
        userLastName,
        username,
        userEmail,
        userPassword,
        userBirthday,
        userHeight,
        userWeight,
      ]
    );

    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// User Log in
router.post("/login", async (req, res) => {
  const { userEmail, userName, userPassword } = req.body;

  try {
    if (userEmail) {
      const userEmailResult = await pool.query(
        "SELECT * FROM tbl_user WHERE useremail = $1",
        [userEmail]
      );

      console.log(userEmailResult.rows[0]);

      if (userEmailResult.rows.length === 0) {
        console.log("wrong email");
        return res.status(401).json("Invalid Email");
      }

      if (userEmailResult.rows[0].userpassword !== userPassword) {
        console.log("wrong password");
        return res.status(401).json("Incorrect Password");
      }

      return res.json(userEmailResult.rows[0]);
    }

    if (userName) {
      const userNameResult = await pool.query(
        "SELECT * FROM tbl_user WHERE username = $1",
        [userName]
      );

      if (userNameResult.rows.length === 0) {
        console.log("wrong email");
        return res.status(401).json("Invalid Username");
      }

      if (userNameResult.rows[0].userpassword !== userPassword) {
        console.log("wrong password");
        return res.status(401).json("Incorrect Password");
      }

      return res.json(userNameResult.rows[0]);
    }

    if (!userEmail && !userName) {
      return res.status(401).json("Both are empty");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//Delete a user by userid
router.delete("/:userid", async (req, res) => {
  try {
    const { userid } = req.params;

    // check whether user exist
    const user = await pool.query("SELECT * FROM tbl_user WHERE userid = $1", [
      userid,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("User does not exist...");
    }

    // if user exists, delete the user and return the id
    const deleteUser = await pool.query(
      "DELETE FROM tbl_user WHERE userId = $1",
      [userid]
    );

    res.json("Successfully Deleted the user: " + userid);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get User information by userid
router.get("/:userid", async (req, res) => {
  try {
    const { userid } = req.params;

    //check whether user exist
    const user = await pool.query("SELECT * FROM tbl_user WHERE userId = $1", [
      userid,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("User does not exist...");
    }

    //get the user info
    const getUserInfo = await pool.query(
      "SELECT * FROM tbl_user WHERE userId = $1",
      [userid]
    );

    res.json(getUserInfo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//search by name[get route]
router.get("/username/:userName", async (req, res) => {
  try {
    const { userName } = req.params;

    const getName = await pool.query(
      "SELECT * FROM tbl_user WHERE userName LIKE $1",
      [`%${userName}%`]
    );

    res.json(getName.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// get user's username
router.get("/:userid/username", async (req, res) => {
  try {
    const { userid } = req.params;

    //check whether user exist
    const user = await pool.query("SELECT * FROM tbl_user WHERE userId = $1", [
      userid,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("User does not exist...");
    }

    //get the user info
    const getUserInfo = await pool.query(
      "SELECT username FROM tbl_user WHERE userId = $1",
      [userid]
    );

    res.json(getUserInfo.rows[0].username);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// edit user profile
router.put("/put/:userid", async (req, res) => {
  try {
    const { userid } = req.params;
    const { userBirthday, userHeight, userWeight } = req.body;

    const editRegularProfile = await pool.query(
      "UPDATE tbl_user SET userBirthday = $1, userHeight = $2, userWeight = $3 WHERE userid = $4 RETURNING *",
      [userBirthday, userHeight, userWeight, userid]
    );

    console.log("editRegularProfile", editRegularProfile);

    res.json(editRegularProfile.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// change user password by userid
router.put("/changepassword/:userid", async (req, res) => {
  try {
    const { userid } = req.params;
    const { newPassword } = req.body;

    const editUserPassword = await pool.query(
      "UPDATE tbl_user SET userPassword = $1 WHERE userid = $2",
      [newPassword, userid]
    );

    console.log("editUserPassword", editUserPassword);

    res.json("Succesfully Changed Password");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// change user password by email
router.put("/changepassword/:useremail", async (req, res) => {
  try {
    const { useremail } = req.params;
    const { newPassword } = req.body;

    const editUserPassword = await pool.query(
      "UPDATE tbl_user SET userPassword = $1 WHERE useremail = $2",
      [newPassword, useremail]
    );

    console.log("editUserPassword", editUserPassword);

    res.json("Succesfully Changed Password");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.post("/search/username", async (req, res) => {
  try {
    const { userinput } = req.body;

    let editedUserInput = "%" + userinput + "%";

    const searchUser = await pool.query(
      "SELECT * FROM tbl_user WHERE (userFirstName ilike $1) OR (userLastName ilike $1) OR (username like $1)",
      [editedUserInput]
    );

    res.json(searchUser.rows);
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

// Returns true if a user is an owner of a league or creator of a team
router.get("/isowner/:userid", async (req, res) => {
  try {
    const { userid } = req.params;

    // check whether the user is a creator of a team
    const teamCheck = await pool.query(
      "SELECT * FROM tbl_team WHERE teamcreator = $1",
      [userid]
    );

    // check whether the user is a owner of a team

    const leagueCheck = await pool.query(
      "SELECT * FROM tbl_league WHERE leaguecreator = $1",
      [userid]
    );

    if (teamCheck.rows.length === 0 || leagueCheck.rows.length === 0) {
      return res.json(false);
    }

    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//get user's league from the team
router.get("/getLeague/:userid", async (req, res) => {
  try {
    const { userid } = req.params;

    const getAllTeam = await pool.query(
      "SELECT * FROM tbl_team_players WHERE userid = $1",
      [userid]
    );

    //use the return value from the get all team
    const teamIds = getAllTeam.rows.map((item) => item.teamid);
    //const leagueIds = [];
    const leagueInfo = [];

    for (const teamid of teamIds) {
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
