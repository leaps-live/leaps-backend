const uploadImage = require("../middleware/s3.upload");

const uploadFile = async (req, res) => {
  uploadImage(req, res, async function (err) {
    if (err) {
      return res.status(400).send({
        result: 0,
        message: err,
      });
    }

    return res.status(200).send({
      result: 1,
      message: "uploaded successfully",
    });
  });
};

exports.uploadSingle = (req, res) => {
  // req.file contains a file object
  res.json(req.file);
};

module.exports = {
  uploadFile,
};
