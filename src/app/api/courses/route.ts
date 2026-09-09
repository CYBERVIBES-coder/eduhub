import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/courses
 * Fetch all published courses with lecture and enrollment counts
 */
export async function GET(req: NextRequest) {
  try {
    const courses = await prisma.course.findMany({
      where: { published: true },
      select: {
        id: true,
        title: true,
        description: true,
        coverImage: true,
        instructor: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            lectures: true,
            enrollments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(courses, { status: 200 })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}
