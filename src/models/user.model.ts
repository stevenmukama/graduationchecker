import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// -------------------- ENUM --------------------
export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
}

// -------------------- INTERFACE --------------------
export interface UserDocument extends Document {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  comparePassword(password: string): Promise<boolean>;

  // Optional fields for password reset
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
}

// -------------------- SCHEMA --------------------
const UserSchema = new Schema<UserDocument>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.STUDENT,
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Number },
  },
  { timestamps: true },
);

// -------------------- PRE SAVE --------------------
UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// -------------------- INSTANCE METHODS --------------------
UserSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

// -------------------- MODEL --------------------
const UserModel = mongoose.model<UserDocument>('User', UserSchema);
export default UserModel;
