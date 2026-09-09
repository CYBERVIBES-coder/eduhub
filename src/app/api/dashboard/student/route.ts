import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/dashboard/student
 * Fetch student dashboard data:
 * - Enrolled courses
 * - Upcoming deadlines
 * - Recent grades
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

    const userId = (session.user as any).id

    // Enrolled courses
    const enrolledCourses = await prisma.enrollment.findMany({
      where: { studentId: userId },
      select: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            coverImage: true,
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    })

    // Upcoming deadlines (next 14 days)
    const upcomingDeadlines = await prisma.assignment.findMany({
      where: {
        course: {
          enrollments: {
            some: { studentId: userId },
          },
        },
        dueDate: {
          gte: new Date(),
          lte: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
      },
      select: {
        id: true,
        title: true,
        dueDate: true,
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { dueDate: 'asc' },
      take: 5,
    })

    // Recent grades (last 10)
    const recentGrades = await prisma.submission.findMany({
      where: {
        studentId: userId,
        grade: { not: null },
      },
      select: {
        id: true,
        grade: true,
        assignment: {
          select: {
            title: true,
            maxPoints: true,
            course: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: { gradedAt: 'desc' },
      take: 10,
    })

    const formattedGrades = recentGrades.map((g) => ({
      id: g.id,
      grade: g.grade,
      maxPoints: g.assignment.maxPoints,
      assignment: {
        title: g.assignment.title,
      },
      course: {
        id: g.assignment.course.id,
        title: g.assignment.course.title,
      },
    }))

    return NextResponse.json(
      {
        enrolledCourses: enrolledCourses.map((e) => e.course),
        upcomingDeadlines,
        recentGrades: formattedGrades,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching student dashboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
