import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authenticateRequest.middleware";
import { submitGraduationDocument } from "../services/studentDocument.service";
import { calculateStudentGraduationProgress } from "../services/graduationProgress.service";

export const uploadStudentDocument = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.file) {
    return res.status(400).json({ message: "File is required" });
  }

  const document = await submitGraduationDocument(
    req.user!.userId,
    req.body.documentName,
    req.file.path
  );

  res.json(document);
};

export const getStudentProgress = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const progress = await calculateStudentGraduationProgress(req.user!.userId);
  res.json(progress);
};