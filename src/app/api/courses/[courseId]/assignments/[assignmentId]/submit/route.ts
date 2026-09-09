import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/courses/[courseId]/assignments/[assignmentId]/submit
 * Submit or update a submission for an assignment
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { courseId: string; assignmentId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { courseId, assignmentId } = params
    const userId = (session.user as any).id
    const { textContent } = await req.json()

    // Validate input
    if (!textContent || !textContent.trim()) {
      return NextResponse.json(
        { error: 'Answer text is required' },
        { status: 400 }
      )
    }

    // Check if user already has a submission
    const existingSubmission = await prisma.submission.findUnique({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId: userId,
        },
      },
    })

    if (existingSubmission) {
      return NextResponse.json(
        { error: 'You have already submitted this assignment' },
        { status: 409 }
      )
    }

    // Create submission
    const submission = await prisma.submission.create({
      data: {
        assignmentId,
        studentId: userId,
        textContent: textContent.trim(),
        submittedAt: new Date(),
      },
      select: {
        id: true,
        textContent: true,
        fileUrl: true,
        submittedAt: true,
        grade: true,
        feedback: true,
        gradedAt: true,
      },
    })

    return NextResponse.json(submission, { status: 201 })
  } catch (error) {
    console.error('Error creating submission:', error)
    return NextResponse.json(
      { error: 'Failed to submit assignment' },
      { status: 500 }
    )
  }
}
