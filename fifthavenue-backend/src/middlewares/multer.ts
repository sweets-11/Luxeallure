import multer from "multer";
import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";

const UPLOADS_FOLDER = "uploads";

// Ensure the uploads folder exists
if (!fs.existsSync(UPLOADS_FOLDER)) {
  fs.mkdirSync(UPLOADS_FOLDER);
}

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, UPLOADS_FOLDER);
  },
  filename(req, file, callback) {
    const id = uuid();
    const extName = file.originalname.split(".").pop();
    callback(null, `${id}.${extName}`);
  },
});

// export const singleUpload = multer({ storage }).single("photo");

export const multipleUpload = multer({ storage }).fields([
  { name: "images", maxCount: 3 },
  { name: "video", maxCount: 1 }
]);
