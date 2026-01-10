// import multer from "multer";
// import path from "path";
// import fs from "fs";

// const uploadDirectory = path.join(process.cwd(), "uploads");
// if (!fs.existsSync(uploadDirectory)) fs.mkdirSync(uploadDirectory);

// const storage = multer.diskStorage({
//   destination: uploadDirectory,
//   filename: (_, file, callback) => {
//     callback(null, Date.now() + "-" + file.originalname);
//   },
// });

// export const fileUploadMiddleware = multer({ storage });
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDirectory = path.join(process.cwd(), 'uploads');

// Make sure upload folder exists
if (!fs.existsSync(uploadDirectory)) fs.mkdirSync(uploadDirectory);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (_req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// Optional: filter for PDF, images, etc.
const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  // Accept all for now
  cb(null, true);
};

export const fileUploadMiddleware = multer({ storage, fileFilter });
