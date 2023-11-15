const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const config = require("../config/s3.config");

const S3Data = new S3Client({
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadImage = multer({
  storage: multerS3({
    s3: S3Data,
    bucket: config.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: (req, file, cb) => {
      if (file.fieldname == "singlefile") {
        const fileName =
          Date.now() + "_" + file.fieldname + "_" + file.originalname;
        cb(null, fileName);
      }
    },
  }),
});

module.exports = uploadImage;
