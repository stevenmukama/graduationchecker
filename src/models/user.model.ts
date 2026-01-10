import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export enum UserRole {
  STUDENT = "student",
  ADMIN = "admin",
}

export interface UserDocument extends Document {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<UserDocument>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.STUDENT },
}, { timestamps: true });

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<UserDocument>("User", UserSchema);