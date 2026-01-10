import { Router } from "express";
import { authenticateRequest } from "../middlewares/authenticateRequest.middleware";
import { fileUploadMiddleware } from "../utils/fileUpload.util";
import {
  uploadStudentDocument,
  getStudentProgress,
} from "../controllers/studentDocumentSubmission.controller";

const router = Router();

router.post(
  "/documents/upload",
  authenticateRequest,
  fileUploadMiddleware.single("file"),
  uploadStudentDocument
);

router.get(
  "/documents/progress",
  authenticateRequest,
  getStudentProgress
);

export default router;