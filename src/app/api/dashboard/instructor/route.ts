import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/dashboard/instructor
 * Fetch instructor dashboard data:
 * - My courses (with enrollment and submission counts)
 * - Pending grading (ungraded submissions)
 */
export async function GET(req: NextRequest) {
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

    // For instructors, only fetch their own courses; for admins, fetch all
    const courseFilter =
      userRole === 'ADMIN'
        ? {}
        : {
            instructorId: userId,
          }

    // Fetch courses with enrollment and submission counts
    const courses = await prisma.course.findMany({
      where: courseFilter,
      select: {
        id: true,
        title: true,
        description: true,
        _count: {
          select: {
            enrollments: true,
            submissions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Fetch pending grading (ungraded submissions)
    const pendingGrading = await prisma.submission.findMany({
      where: {
        grade: null,
        assignment: courseFilter,
      },
      select: {
        id: true,
        student: {
          select: {
            name: true,
          },
        },
        assignment: {
          select: {
            title: true,
            course: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
      take: 5,
    })

    const formattedPending = pendingGrading.map((p) => ({
      id: p.id,
      studentName: p.student.name || 'Unknown',
      assignment: {
        title: p.assignment.title,
      },
      course: {
        id: p.assignment.course.id,
        title: p.assignment.course.title,
      },
    }))

    return NextResponse.json(
      {
        courses,
        pendingGrading: formattedPending,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching instructor dashboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
