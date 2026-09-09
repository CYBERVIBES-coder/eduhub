import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/courses/[courseId]/assignments/[assignmentId]/my-submission
 * Fetch current user's submission for an assignment
 */
export async function GET(
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

    const submission = await prisma.submission.findUnique({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId: userId,
        },
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

    if (!submission) {
      return NextResponse.json(null, { status: 200 })
    }

    return NextResponse.json(submission, { status: 200 })
  } catch (error) {
    console.error('Error fetching submission:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submission' },
      { status: 500 }
    )
  }
}
