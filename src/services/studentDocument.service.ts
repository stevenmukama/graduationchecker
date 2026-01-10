import GraduationDocument from "../models/graduationDocument.model";
import { GRADUATION_REQUIRED_DOCUMENTS } from "../constants/graduationRequiredDocuments";

export const submitGraduationDocument = async (
  studentId: string,
  documentName: string,
  filePath: string
) => {
  if (!GRADUATION_REQUIRED_DOCUMENTS.includes(documentName)) {
    throw new Error("Invalid document type");
  }

  const document = await GraduationDocument.findOneAndUpdate(
    { studentId, documentName },
    { filePath, status: "pending" },
    { new: true }
  );

  if (!document) throw new Error("Document record not found");

  return document;
};