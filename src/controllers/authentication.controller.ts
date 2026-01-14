import { Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

import User, {
  UserDocument,
  UserRole as ModelUserRole,
} from '../models/user.model';
import GraduationDocument from '../models/graduationDocument.model';
import { GRADUATION_REQUIRED_DOCUMENTS } from '../constants/graduationRequiredDocuments';

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../services/jwtToken.service';

import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  AuthResponseDto,
  UserRole as AuthUserRole,
} from '../types/auth.types';

/* -------------------------------------------------------------------------- */
/*                                Role Mappers                                */
/* -------------------------------------------------------------------------- */

const parseUserRole = (role?: AuthUserRole): ModelUserRole => {
  if (role === 'ADMIN') {
    return ModelUserRole.ADMIN;
  }
  return ModelUserRole.STUDENT;
};

const mapRoleToAuthUserRole = (role: ModelUserRole): AuthUserRole => {
  if (role === ModelUserRole.ADMIN) {
    return 'ADMIN';
  }
  return 'STUDENT';
};

/* -------------------------------------------------------------------------- */
/*                                   REGISTER                                 */
/* -------------------------------------------------------------------------- */

export const registerUser = async (
  req: Request<{}, {}, RegisterDto>,
  res: Response,
): Promise<Response> => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const user = await User.create({
      fullName: `${firstName} ${lastName}`,
      email,
      password,
      role: parseUserRole(role),
    });

    if (user.role === ModelUserRole.STUDENT) {
      await GraduationDocument.insertMany(
        GRADUATION_REQUIRED_DOCUMENTS.map((documentName) => ({
          studentId: user._id,
          documentName,
        })),
      );
    }

    const response: AuthResponseDto = {
      user: {
        id: user._id.toString(),
        firstName,
        lastName,
        email: user.email,
        role: mapRoleToAuthUserRole(user.role),
      },
      accessToken: generateAccessToken(user),
      refreshToken: generateRefreshToken(user),
    };

    return res.status(201).json(response);
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Registration failed' });
  }
};

/* -------------------------------------------------------------------------- */
/*                                     LOGIN                                  */
/* -------------------------------------------------------------------------- */

export const loginUser = async (
  req: Request<{}, {}, LoginDto>,
  res: Response,
): Promise<Response> => {
  try {
    const { email, password } = req.body;

    const user: UserDocument | null = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const nameParts = user.fullName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    const response: AuthResponseDto = {
      user: {
        id: user._id.toString(),
        firstName,
        lastName,
        email: user.email,
        role: mapRoleToAuthUserRole(user.role),
      },
      accessToken: generateAccessToken(user),
      refreshToken: generateRefreshToken(user),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Login failed' });
  }
};

/* -------------------------------------------------------------------------- */
/*                               REFRESH TOKEN                                */
/* -------------------------------------------------------------------------- */

export const refreshToken = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { token } = req.body as { token?: string };

    if (!token) {
      return res.status(400).json({ message: 'Refresh token required' });
    }

    const payload = verifyRefreshToken(token) as { id: string };

    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      accessToken: generateAccessToken(user),
      refreshToken: generateRefreshToken(user),
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

/* -------------------------------------------------------------------------- */
/*                               FORGOT PASSWORD                               */
/* -------------------------------------------------------------------------- */

export const forgotPassword = async (
  req: Request<{}, {}, ForgotPasswordDto>,
  res: Response,
): Promise<Response> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = await bcrypt.hash(rawToken, 10);
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;

    await user.save();

    console.log(`Reset token for ${email}: ${rawToken}`);

    return res.status(200).json({ message: 'Reset token generated' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Failed to generate reset token' });
  }
};

/* -------------------------------------------------------------------------- */
/*                                RESET PASSWORD                               */
/* -------------------------------------------------------------------------- */

export const resetPassword = async (
  req: Request<{}, {}, ResetPasswordDto>,
  res: Response,
): Promise<Response> => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user || !user.resetPasswordToken) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const isValid = await bcrypt.compare(token, user.resetPasswordToken);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ message: 'Password reset failed' });
  }
};
