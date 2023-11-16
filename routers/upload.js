const express = require("express");
const router = express.Router();

const upload = require("../middleware/s3.upload");
const uploadController = require("../controllers/uploads.controller");

router.post(
  "/upload-single",
  upload.single("file"),
  uploadController.uploadSingle
);
router.post(
  "/upload-multiple",
  upload.array("files", 5),
  uploadController.uploadMultiple
);

/* ------------------------ upload and error handling ----------------------- */
router.post("/upload-single-v2", uploadController.uploadSingleV2);

module.exports = router;
