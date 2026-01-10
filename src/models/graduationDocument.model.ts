import mongoose, { Schema, Document } from "mongoose";

export enum GraduationDocumentStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

export interface GraduationDocumentDocument extends Document {
  studentId: mongoose.Types.ObjectId;
  documentName: string;
  filePath: string;
  status: GraduationDocumentStatus;
  feedback?: string;
}

const GraduationDocumentSchema = new Schema<GraduationDocumentDocument>({
  studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  documentName: { type: String, required: true },
  filePath: { type: String, default: "" },
  status: {
    type: String,
    enum: Object.values(GraduationDocumentStatus),
    default: GraduationDocumentStatus.PENDING,
  },
  feedback: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model<GraduationDocumentDocument>(
  "GraduationDocument",
  GraduationDocumentSchema
);