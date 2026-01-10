import { Request, Response } from "express";
import GraduationDocument from "../models/graduationDocument.model";

export const verifyStudentDocument = async (req: Request, res: Response) => {
  const { documentId, status, feedback } = req.body;

  const document = await GraduationDocument.findByIdAndUpdate(
    documentId,
    { status, feedback },
    { new: true }
  );

  if (!document) {
    return res.status(404).json({ message: "Document not found" });
  }

  res.json(document);
};