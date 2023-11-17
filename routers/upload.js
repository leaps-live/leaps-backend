const express = require("express");
const router = express.Router();
const util = require("util");

const multerS3 = require("multer-s3");
const multer = require("multer");
const { S3Client } = require("@aws-sdk/client-s3");
const config = require("../config/s3.config");
const path = require("path");

const uploadController = require("../controllers/uploads.controller");

const s3 = new S3Client({
  region: "us-west-2",
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
});

let saveUserId;

// middleware to get user id before file upload
function userMiddleware(req, res, next) {
  console.log("user came in. Hello " + req.params.userid);
  saveUserId = req.params.userid;
  next();
}

const upload = multer({
  storage: multerS3({
    s3,
    acl: "public-read",
    bucket: config.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const fileName = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
      cb(
        null,
        `${saveUserId}/profilepicture/${fileName}${path.extname(
          file.originalname
        )}`
      );
    },
  }),
});

router.post("/upload-single-v3/:userid", userMiddleware, async (req, res) => {
  const uploadFile = util.promisify(upload.single("file"));
  try {
    await uploadFile(req, res);
    res.json(req.file);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post(
  "/upload-multiple",
  upload.array("files", 5),
  uploadController.uploadMultiple
);

module.exports = router;
