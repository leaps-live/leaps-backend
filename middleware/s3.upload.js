const multerS3 = require("multer-s3");
const multer = require("multer");
const { S3Client } = require("@aws-sdk/client-s3");
const config = require("../config/s3.config");
const path = require("path");

const s3 = new S3Client({
  region: "us-west-2",
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3,
    acl: "public-read",
    bucket: config.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const fileName = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
      cb(null, `${fileName}${path.extname(file.originalname)}`);
    },
  }),
});

module.exports = upload;
