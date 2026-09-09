import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/courses/[courseId]/assignments
 * Fetch all assignments for a course
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params

    const assignments = await prisma.assignment.findMany({
      where: { courseId },
      select: {
        id: true,
        title: true,
        description: true,
        dueDate: true,
        maxPoints: true,
      },
      orderBy: { dueDate: 'asc' },
    })

    return NextResponse.json(assignments, { status: 200 })
  } catch (error) {
    console.error('Error fetching assignments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assignments' },
      { status: 500 }
    )
  }
}
