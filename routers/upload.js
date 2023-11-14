const uploadController = require("../controllers/uploads.controller");

const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/image-upload", uploadController.uploadFile);

module.exports = router;
