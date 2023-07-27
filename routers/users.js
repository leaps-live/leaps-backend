const express = require("express");
const router = express.Router();
const pool = require("../db");

// Register New User
router.post("/register", async (req, res) => {
  try {
    const {
      userFormalName,
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
      "INSERT INTO tbl_user (userFormalName, username, userEmail, userPassword, userBirthday, userHeight, userWeight) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        userFormalName,
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
  const { userEmail, userPassword } = req.body;

  try {
    const user = await pool.query(
      "SELECT * FROM tbl_user WHERE userEmail = $1",
      [userEmail]
    );

    if (user.rows.length === 0) {
      console.log("wrong email");
      return res.status(401).json("Invalid Credentials");
    }

    if (user.rows[0].userPassword !== userPassword) {
      console.log("wrong password");
      return res.status(401).json("Invalid Credential");
    }

    return res.json(user.rows[0]);
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
router.get("/userName", async (req, res) => {
    try {
      const {userName} = req.body;

      const getName = await pool.query(
        "SELECT * FROM tbl_user WHERE userName LIKE $1",
        [`%${userName}%`]
      );

      res.json(getName.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
})


module.exports = router;
