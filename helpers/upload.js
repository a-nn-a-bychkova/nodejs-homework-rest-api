const multer = require("multer");
const path = require("path");
//если переменная окружения
require("dotenv").config();
const UPLOAD_DIR = path(proces.cwd(), process.env.UPLOAD_DIR);

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 },
  fileFilter: (req, res, cb) => {
    if (file.minetype.includes("image")) {
      cb(null, true);
      return;
    }
    cb(null, false);
  },
});
module.exports = upload;
