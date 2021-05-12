import util from "util";
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, 'D:/WebDev/medclyn/client/src/assets/uploads');
    },
    filename: function (req, file, callback) {
      callback(null, file.originalname);
    }
  });

const upload = multer({ storage: storage }).array("photos", 6);
const uploadFiles = util.promisify(upload);

export { uploadFiles };
