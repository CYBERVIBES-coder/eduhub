import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/instructor/courses/[courseId]/submissions
 * Fetch all submissions for a course (instructor only)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string } }
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
    const { courseId } = params

    // Check authorization: only course instructor or admin
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

    // Fetch all submissions for this course's assignments
    const submissions = await prisma.submission.findMany({
      where: {
        assignment: {
          courseId,
        },
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
      orderBy: { submittedAt: 'desc' },
    })

    return NextResponse.json(submissions, { status: 200 })
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}
