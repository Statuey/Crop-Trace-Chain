import config from "../config/config.js";
import multer from "multer";

const upload = multer({ dest: config.upload.dest });

export default upload;
