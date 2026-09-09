'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  description: string | null
  coverImage: string | null
  instructor: {
    name: string | null
  }
  _count: {
    lectures: number
    enrollments: number
  }
}

/**
 * Course catalog page with improved loading and empty states
 */
export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch('/api/courses')
        if (!response.ok) throw new Error('Failed to fetch courses')
        const data = await response.json()
        setCourses(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }
    fetchCourses()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/" className="text-2xl font-bold text-primary-700 hover:text-primary-800">
                EduHub
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">Courses</h1>
              <p className="text-gray-600 mt-1">Explore our course catalog</p>
            </div>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow h-72"></div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <h3 className="text-red-900 font-semibold mb-2">Error loading courses</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && courses.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No courses available</h2>
            <p className="text-gray-600 mb-8">Check back soon for new courses to explore.</p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700"
            >
              Go to Dashboard
            </Link>
          </div>
        )}

        {/* Course grid */}
        {!isLoading && !error && courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden border border-gray-200 hover:border-primary-500"
              >
                {course.coverImage ? (
                  <img
                    src={course.coverImage}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <span className="text-4xl">📖</span>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description || 'No description'}
                  </p>
                  <div className="flex justify-between text-xs text-gray-500 mb-3">
                    <span>📚 {course._count.lectures} lectures</span>
                    <span>👥 {course._count.enrollments} students</span>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">
                    👨‍🏫 {course.instructor.name || 'Unknown instructor'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
