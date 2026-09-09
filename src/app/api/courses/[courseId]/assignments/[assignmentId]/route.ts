import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/courses/[courseId]/assignments/[assignmentId]
 * Fetch a specific assignment
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string; assignmentId: string } }
) {
  try {
    const { courseId, assignmentId } = params

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      select: {
        id: true,
        title: true,
        description: true,
        dueDate: true,
        maxPoints: true,
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    if (!assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      )
    }

    // Verify assignment belongs to course
    if (assignment.course.id !== courseId) {
      return NextResponse.json(
        { error: 'Assignment not found in this course' },
        { status: 404 }
      )
    }

    return NextResponse.json(assignment, { status: 200 })
  } catch (error) {
    console.error('Error fetching assignment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assignment' },
      { status: 500 }
    )
  }
}
