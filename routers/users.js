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

module.exports = router;
