import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { LectureListItem } from '@/components/LectureListItem'

interface CourseDetailPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: CourseDetailPageProps) {
  const course = await prisma.course.findUnique({
    where: { id: params.id },
  })

  if (!course) {
    return { title: 'Course not found' }
  }

  return {
    title: `${course.title} - EduHub`,
    description: course.description,
  }
}

/**
 * Course detail page showing course info and lecture list.
 * Server component using Prisma to fetch course and lectures.
 */
export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  try {
    // Fetch course with instructor and lectures
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        instructor: {
          select: { id: true, name: true },
        },
        lectures: {
          orderBy: {
            order: 'asc',
          },
          include: {
            _count: {
              select: { attachments: true },
            },
          },
        },
        assignments: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!course) {
      notFound()
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/courses" className="text-gray-600 hover:text-gray-900 text-sm font-medium mb-4 inline-block">
              ← Back to Courses
            </Link>
          </div>
        </header>

        {/* Course Hero */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-primary-100 mb-6 text-lg">{course.description}</p>
            <div className="flex items-center gap-4 text-primary-100">
              <span>👨‍🏫 {course.instructor.name || 'Unknown Instructor'}</span>
              <span>•</span>
              <span>📚 {course.lectures.length} lecture{course.lectures.length !== 1 ? 's' : ''}</span>
              {course.assignments.length > 0 && (
                <>
                  <span>•</span>
                  <span>📝 {course.assignments.length} assignment{course.assignments.length !== 1 ? 's' : ''}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column: Lectures */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Lectures</h2>
              {course.lectures.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-600">No lectures published yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {course.lectures.map((lecture) => (
                    <LectureListItem
                      key={lecture.id}
                      lecture={lecture}
                      courseId={course.id}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right column: Course info */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 space-y-6">
                {/* Course Info Card */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase">Course Info</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <strong>Status:</strong> {course.published ? '✅ Published' : '🔒 Draft'}
                    </p>
                    <p>
                      <strong>Created:</strong>{' '}
                      {new Date(course.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Assignments */}
                {course.assignments.length > 0 && (
                  <div className="border-t pt-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase">
                      Assignments
                    </h3>
                    <div className="space-y-2">
                      {course.assignments.map((assignment) => (
                        <Link
                          key={assignment.id}
                          href={`/courses/${course.id}/assignments/${assignment.id}`}
                          className="block p-2 bg-gray-50 rounded hover:bg-primary-50 transition text-sm"
                        >
                          <p className="font-medium text-gray-900">{assignment.title}</p>
                          {assignment.dueDate && (
                            <p className="text-xs text-gray-600 mt-1">
                              📅 Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </p>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </main>
      </div>
    )
  } catch (error) {
    console.error('Error loading course:', error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">Failed to load course. Please try again later.</p>
          <Link
            href="/courses"
            className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    )
  }
}
