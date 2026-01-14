import bcrypt from 'bcryptjs';

/**
 * Number of salt rounds for bcrypt
 * 10–12 is a good balance between security & performance
 */
const SALT_ROUNDS = 10;

/**
 * Hash a plain text password
 */
export const hashPassword = async (plainPassword: string): Promise<string> => {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
};

/**
 * Compare a plain text password with a hashed password
 */
export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
