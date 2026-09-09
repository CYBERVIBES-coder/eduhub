/**
 * Validation utilities for forms and inputs
 */

export interface ValidationError {
  field: string
  message: string
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one number
 */
export function validatePassword(password: string): ValidationError[] {
  const errors: ValidationError[] = []

  if (password.length < 8) {
    errors.push({
      field: 'password',
      message: 'Password must be at least 8 characters long',
    })
  }

  if (!/[A-Z]/.test(password)) {
    errors.push({
      field: 'password',
      message: 'Password must contain at least one uppercase letter',
    })
  }

  if (!/[0-9]/.test(password)) {
    errors.push({
      field: 'password',
      message: 'Password must contain at least one number',
    })
  }

  return errors
}

/**
 * Validate registration form
 */
export function validateRegistrationForm(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): ValidationError[] {
  const errors: ValidationError[] = []

  if (!name.trim()) {
    errors.push({ field: 'name', message: 'Name is required' })
  }

  if (!validateEmail(email)) {
    errors.push({ field: 'email', message: 'Invalid email address' })
  }

  if (password !== confirmPassword) {
    errors.push({
      field: 'confirmPassword',
      message: 'Passwords do not match',
    })
  }

  const passwordErrors = validatePassword(password)
  errors.push(...passwordErrors)

  return errors
}
