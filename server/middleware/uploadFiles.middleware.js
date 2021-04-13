import util from "util";
import path from "path";
import multer from "multer";

const __dirname = path.resolve();

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './uploads');
    },
    filename: function (req, file, callback) {
      callback(null, file.originalname);
    }
  });

const upload = multer({ storage: storage }).array("photos", 6);
const uploadFiles = util.promisify(upload);

export { uploadFiles };
