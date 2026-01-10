import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: { userId: string; role: string };
  file?: Express.Multer.File; // single file
  files?:
    | Express.Multer.File[]
    | { [fieldname: string]: Express.Multer.File[] }; // multiple files
}

export const authenticateRequest = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token)
    return res.status(401).json({ message: 'Authentication required' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
