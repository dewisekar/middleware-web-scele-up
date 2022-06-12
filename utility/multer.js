const multer = require("multer");
const fs = require("fs");

//var uploadDir = "./build";//
var uploadDir = "D:/APPLICATION/docs";

//var uploadDir = "/home/projects/docs/";

var storage = multer.diskStorage({
  destination: uploadDir,
  filename: function (req, file, cb) {
    //console.log(uploadDir + "/" + file.originalname);
    fs.exists(uploadDir + "/" + file.originalname, function (exists) {
      if (exists) {
        console.log("Test");
        cb(new Error("File sudah ada"));
      }
      cb(null, file.originalname);
    });
  },
});

const upload = multer({ storage: storage });

module.exports = {
  upload,
};
