import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authenticateRequest.middleware";

export const authorizeAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin privileges required" });
  }
  next();
};