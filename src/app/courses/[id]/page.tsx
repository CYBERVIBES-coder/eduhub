'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Lecture {
  id: string
  title: string
  order: number
  publishedAt: string | null
}

interface Course {
  id: string
  title: string
  description: string | null
  coverImage: string | null
  instructor: {
    name: string | null
  }
  lectures: Lecture[]
}

/**
 * Course detail page - shows course info and lecture list
 */
export default function CourseDetailPage() {
  const params = useParams()
  const courseId = params.id as string

  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await fetch(`/api/courses/${courseId}`)
        if (!response.ok) throw new Error('Course not found')
        const data = await response.json()
        setCourse(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }
    fetchCourse()
  }, [courseId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading course...</p>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link href="/courses" className="text-primary-600 hover:underline">
              ← Back to courses
            </Link>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error || 'Course not found'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/courses" className="text-primary-600 hover:underline text-sm">
            ← Back to courses
          </Link>
        </div>
      </header>

      {/* Course hero */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Cover image */}
            {course.coverImage && (
              <div className="md:col-span-1">
                <img
                  src={course.coverImage}
                  alt={course.title}
                  className="w-full rounded-lg shadow"
                />
              </div>
            )}

            {/* Course info */}
            <div className={course.coverImage ? 'md:col-span-2' : 'md:col-span-3'}>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
              <p className="text-gray-600 text-lg mb-6">{course.description}</p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Instructor:</span> {course.instructor.name || 'Unknown'}
              </p>
              <p className="text-sm text-gray-700 mt-2">
                <span className="font-semibold">Total lectures:</span> {course.lectures.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lectures */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Lectures</h2>

        {course.lectures.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No lectures available yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {course.lectures
              .sort((a, b) => a.order - b.order)
              .map((lecture) => (
                <Link
                  key={lecture.id}
                  href={`/courses/${course.id}/lectures/${lecture.id}`}
                  className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-primary-500 hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary-700">
                        {lecture.order}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {lecture.title}
                      </h3>
                      {!lecture.publishedAt && (
                        <p className="text-xs text-gray-500 mt-1">Not yet published</p>
                      )}
                    </div>
                    <span className="text-primary-600 font-medium">→</span>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </main>
    </div>
  )
}
