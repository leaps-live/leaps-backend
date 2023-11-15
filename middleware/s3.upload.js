const multer = require("multer");
const multerS3 = require("multer-s3-transform");
const { S3 } = require("@aws-sdk/client-s3");
const config = require("../config/s3.config");

const S3Data = new S3({
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: S3Data,
    bucket: config.AWS_BUCKET_NAME,
    acl: "public-read",
    key: function (req, file, cb) {
      if (file.fieldname == "singlefile") {
        cb(null, "single/" + file.originalname);
      } else if (file.fieldname == "multiplefiles") {
        cb(null, "multiple/" + file.originalname);
      }
    },
  }),
});

module.exports = upload.fields([
  {
    name: "singlefile",
    maxCount: 1,
  },
  {
    name: "multiplefiles:",
    maxCount: 5,
  },
]);
