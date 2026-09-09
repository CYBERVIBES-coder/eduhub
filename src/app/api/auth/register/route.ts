import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth-utils'
import { validateRegistrationForm } from '@/lib/validation'

/**
 * POST /api/auth/register
 * Register a new user with email and password.
 * Request body: { name, email, password, confirmPassword }
 */
export async function POST(req: NextRequest) {
  try {
    const { name, email, password, confirmPassword } = await req.json()

    // Validate input
    const validationErrors = validateRegistrationForm(
      name,
      email,
      password,
      confirmPassword
    )

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { errors: validationErrors },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { errors: [{ field: 'email', message: 'Email already in use' }] },
        { status: 409 }
      )
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'STUDENT', // Default role
      },
    })

    return NextResponse.json(
      { message: 'User created successfully', userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { errors: [{ field: 'form', message: 'Registration failed' }] },
      { status: 500 }
    )
  }
}
