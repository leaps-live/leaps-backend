// const uploadController = require("../controllers/uploads.controller");
const uploadImage = require("../middleware/s3.upload");

const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post(
  "/image-upload",
  uploadImage.single("image"), // our uploadImage middleware
  (req, res, next) => {
    /* 
           req.file = { 
             fieldname, originalname, 
             mimetype, size, bucket, key, location
           }
        */

    // location key in req.file holds the s3 url for the image
    let data = {};
    if (req.file) {
      data.image = req.file.location;
    }

    // HERE IS YOUR LOGIC TO UPDATE THE DATA IN DATABASE
  }
);

module.exports = router;
