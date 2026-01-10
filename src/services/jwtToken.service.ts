import jwt from "jsonwebtoken";
import { UserDocument } from "../models/user.model";

export const generateJwtToken = (user: UserDocument): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET missing");
  }

  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};