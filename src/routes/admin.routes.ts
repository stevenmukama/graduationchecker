import { Router } from "express";
import { authenticateRequest } from "../middlewares/authenticateRequest.middleware";
import { authorizeAdmin } from "../middlewares/authorizeAdmin.middleware";
import { verifyStudentDocument } from "../controllers/adminDocumentVerification.controller";

const router = Router();

router.post(
  "/documents/verify",
  authenticateRequest,
  authorizeAdmin,
  verifyStudentDocument
);

export default router;