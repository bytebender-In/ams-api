import * as bcrypt from 'bcrypt';

/**
 * Hashes a password using bcrypt
 * @param password - The plain text password to hash
 * @returns Promise<string> - The hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

/**
 * Compares a plain text password with a hashed password
 * @param password - The plain text password to check
 * @param hashedPassword - The hashed password to compare against
 * @returns Promise<boolean> - Whether the passwords match
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};