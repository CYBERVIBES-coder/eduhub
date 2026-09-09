import bcryptjs from 'bcryptjs'

const SALT_ROUNDS = 10

/**
 * Hash a plaintext password using bcryptjs.
 * @param password - Plaintext password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, SALT_ROUNDS)
}

/**
 * Validate a plaintext password against a hash.
 * @param password - Plaintext password
 * @param hash - Password hash
 * @returns True if password matches hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcryptjs.compare(password, hash)
}
