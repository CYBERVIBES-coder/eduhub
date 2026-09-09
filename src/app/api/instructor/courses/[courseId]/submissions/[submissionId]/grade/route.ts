import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/instructor/courses/[courseId]/submissions/[submissionId]/grade
 * Grade a submission (instructor only)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { courseId: string; submissionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userRole = (session.user as any).role
    const userId = (session.user as any).id
    const { courseId, submissionId } = params
    const { grade, feedback } = await req.json()

    // Validate grade
    if (typeof grade !== 'number' || grade < 0) {
      return NextResponse.json(
        { error: 'Invalid grade' },
        { status: 400 }
      )
    }

    // Check authorization
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { instructorId: true },
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    if (userRole !== 'ADMIN' && course.instructorId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Verify submission belongs to course
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      select: {
        assignment: {
          select: {
            courseId: true,
            maxPoints: true,
          },
        },
      },
    })

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    if (submission.assignment.courseId !== courseId) {
      return NextResponse.json(
        { error: 'Submission not found in this course' },
        { status: 404 }
      )
    }

    // Validate grade against max points
    if (grade > submission.assignment.maxPoints) {
      return NextResponse.json(
        { error: `Grade cannot exceed ${submission.assignment.maxPoints}` },
        { status: 400 }
      )
    }

    // Update submission with grade and feedback
    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        grade,
        feedback: feedback || null,
        gradedAt: new Date(),
      },
      select: {
        id: true,
        student: {
          select: {
            name: true,
            email: true,
          },
        },
        textContent: true,
        fileUrl: true,
        submittedAt: true,
        grade: true,
        feedback: true,
        assignment: {
          select: {
            id: true,
            title: true,
            maxPoints: true,
          },
        },
      },
    })

    return NextResponse.json(updatedSubmission, { status: 200 })
  } catch (error) {
    console.error('Error grading submission:', error)
    return NextResponse.json(
      { error: 'Failed to grade submission' },
      { status: 500 }
    )
  }
}
