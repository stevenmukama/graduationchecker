import { Request, Response } from "express";
import User, { UserRole } from "../models/user.model";
import GraduationDocument from "../models/graduationDocument.model";
import { GRADUATION_REQUIRED_DOCUMENTS } from "../constants/graduationRequiredDocuments";
import { generateJwtToken } from "../services/jwtToken.service";

export const registerUser = async (req: Request, res: Response) => {
  const { fullName, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  const user = await User.create({
    fullName,
    email,
    password,
    role: role === UserRole.ADMIN ? UserRole.ADMIN : UserRole.STUDENT,
  });

  if (user.role === UserRole.STUDENT) {
    await GraduationDocument.insertMany(
      GRADUATION_REQUIRED_DOCUMENTS.map(documentName => ({
        studentId: user._id,
        documentName,
      }))
    );
  }

  res.status(201).json({
    token: generateJwtToken(user),
    user,
  });
};