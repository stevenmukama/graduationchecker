import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDirectory = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDirectory)) fs.mkdirSync(uploadDirectory);

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (_, file, callback) => {
    callback(null, Date.now() + "-" + file.originalname);
  },
});

export const fileUploadMiddleware = multer({ storage });