import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CourseCard } from '@/components/CourseCard'

export const metadata = {
  title: 'Courses - EduHub',
}

/**
 * Course catalog page showing all published courses.
 * Server component using Prisma to fetch courses.
 */
export default async function CoursesPage() {
  try {
    // Fetch all published courses
    const courses = await prisma.course.findMany({
      where: {
        published: true,
      },
      include: {
        instructor: {
          select: { name: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm font-medium mb-4 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Browse Courses</h1>
            <p className="text-gray-600 mt-2">Explore all available courses</p>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {courses.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="text-4xl mb-4">📚</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No courses available
              </h2>
              <p className="text-gray-600">
                Courses will appear here once instructors create them.
              </p>
              <Link
                href="/dashboard"
                className="mt-6 inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-6">
                {courses.length} course{courses.length !== 1 ? 's' : ''} available
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    )
  } catch (error) {
    console.error('Error loading courses:', error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">
            Failed to load courses. Please try again later.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Return Home
          </Link>
        </div>
      </div>
    )
  }
}
