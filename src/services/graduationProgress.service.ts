import GraduationDocument from "../models/graduationDocument.model";
import { GRADUATION_REQUIRED_DOCUMENTS } from "../constants/graduationRequiredDocuments";

export const calculateStudentGraduationProgress = async (studentId: string) => {
  const total = GRADUATION_REQUIRED_DOCUMENTS.length;

  const uploaded = await GraduationDocument.countDocuments({
    studentId,
    filePath: { $ne: "" },
  });

  return {
    totalDocuments: total,
    uploadedDocuments: uploaded,
    percentage: Number(((uploaded / total) * 100).toFixed(2)),
  };
};