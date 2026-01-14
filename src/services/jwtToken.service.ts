import jwt from 'jsonwebtoken';
import { UserDocument, UserRole } from '../models/user.model';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const generateAccessToken = (user: UserDocument): string => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    ACCESS_SECRET,
    { expiresIn: '15m' },
  );
};

export const generateRefreshToken = (user: UserDocument): string => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    REFRESH_SECRET,
    { expiresIn: '7d' },
  );
};

export const verifyAccessToken = (
  token: string,
): { id: string; email: string; role: UserRole } => {
  return jwt.verify(token, ACCESS_SECRET) as {
    id: string;
    email: string;
    role: UserRole;
  };
};

export const verifyRefreshToken = (
  token: string,
): { id: string; email: string; role: UserRole } => {
  return jwt.verify(token, REFRESH_SECRET) as {
    id: string;
    email: string;
    role: UserRole;
  };
};
