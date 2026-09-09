import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/courses/[courseId]/lectures/[lectureId]
 * Fetch a specific lecture with video, notes, and attachments
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string; lectureId: string } }
) {
  try {
    const { courseId, lectureId } = params

    const lecture = await prisma.lecture.findUnique({
      where: { id: lectureId },
      select: {
        id: true,
        title: true,
        order: true,
        videoUrl: true,
        notesMarkdown: true,
        attachments: {
          select: {
            id: true,
            filename: true,
            fileUrl: true,
            fileType: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    if (!lecture) {
      return NextResponse.json(
        { error: 'Lecture not found' },
        { status: 404 }
      )
    }

    // Verify the lecture belongs to the requested course
    if (lecture.course.id !== courseId) {
      return NextResponse.json(
        { error: 'Lecture not found in this course' },
        { status: 404 }
      )
    }

    return NextResponse.json(lecture, { status: 200 })
  } catch (error) {
    console.error('Error fetching lecture:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lecture' },
      { status: 500 }
    )
  }
}
