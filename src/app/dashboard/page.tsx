'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface StudentDashboardData {
  enrolledCourses: Array<{
    id: string
    title: string
    description: string | null
    coverImage: string | null
  }>
  upcomingDeadlines: Array<{
    id: string
    title: string
    dueDate: string
    course: {
      id: string
      title: string
    }
  }>
  recentGrades: Array<{
    id: string
    grade: number
    maxPoints: number
    assignment: {
      title: string
    }
    course: {
      id: string
      title: string
    }
  }>
}

interface InstructorDashboardData {
  courses: Array<{
    id: string
    title: string
    description: string | null
    _count: {
      enrollments: number
      submissions: number
    }
  }>
  pendingGrading: Array<{
    id: string
    studentName: string
    assignment: {
      title: string
    }
    course: {
      id: string
      title: string
    }
  }>
}

/**
 * Role-aware dashboard
 * Students see: enrolled courses, upcoming deadlines, recent grades
 * Instructors see: their courses, student counts, pending grading
 * Admins see: all courses, all users (Phase 7)
 */
export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [studentData, setStudentData] = useState<StudentDashboardData | null>(null)
  const [instructorData, setInstructorData] = useState<InstructorDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const userRole = (session?.user as any)?.role
  const userName = session?.user?.name || 'User'

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    async function fetchDashboardData() {
      try {
        if (userRole === 'STUDENT') {
          const response = await fetch('/api/dashboard/student')
          if (!response.ok) throw new Error('Failed to fetch student data')
          const data = await response.json()
          setStudentData(data)
        } else if (userRole === 'INSTRUCTOR' || userRole === 'ADMIN') {
          const response = await fetch('/api/dashboard/instructor')
          if (!response.ok) throw new Error('Failed to fetch instructor data')
          const data = await response.json()
          setInstructorData(data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    if (status === 'authenticated' && userRole) {
      fetchDashboardData()
    }
  }, [status, userRole, router])

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome, <span className="font-semibold">{userName}</span> ({userRole})
            </p>
          </div>
          <form
            action={async () => {
              const { signOut } = await import('next-auth/react')
              await signOut({ redirect: true, callbackUrl: '/' })
            }}
          >
            <button
              type="submit"
              className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Sign Out
            </button>
          </form>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* STUDENT DASHBOARD */}
        {userRole === 'STUDENT' && studentData && (
          <div className="space-y-8">
            {/* Enrolled Courses */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Enrolled Courses</h2>
              {studentData.enrolledCourses.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-600 mb-4">You are not enrolled in any courses yet.</p>
                  <Link
                    href="/courses"
                    className="inline-block px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700"
                  >
                    Browse Courses
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {studentData.enrolledCourses.map((course) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.id}`}
                      className="bg-white rounded-lg shadow hover:shadow-lg transition border border-gray-200 hover:border-primary-500 overflow-hidden"
                    >
                      {course.coverImage && (
                        <img
                          src={course.coverImage}
                          alt={course.title}
                          className="w-full h-40 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {course.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* Upcoming Deadlines */}
            {studentData.upcomingDeadlines.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Deadlines</h2>
                <div className="space-y-4">
                  {studentData.upcomingDeadlines.map((deadline) => {
                    const daysUntil = Math.ceil(
                      (new Date(deadline.dueDate).getTime() - Date.now()) /
                        (1000 * 60 * 60 * 24)
                    )
                    const isUrgent = daysUntil <= 3 && daysUntil >= 0
                    const isOverdue = daysUntil < 0

                    return (
                      <Link
                        key={deadline.id}
                        href={`/courses/${deadline.course.id}/assignments/${deadline.id}`}
                        className={`p-4 rounded-lg border-l-4 hover:shadow-lg transition ${
                          isOverdue
                            ? 'bg-red-50 border-red-500 border-l-4'
                            : isUrgent
                              ? 'bg-amber-50 border-amber-500 border-l-4'
                              : 'bg-green-50 border-green-500 border-l-4'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {deadline.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {deadline.course.title}
                            </p>
                          </div>
                          <div className="text-right">
                            <p
                              className={`text-sm font-semibold ${
                                isOverdue
                                  ? 'text-red-700'
                                  : isUrgent
                                    ? 'text-amber-700'
                                    : 'text-green-700'
                              }`}
                            >
                              {isOverdue
                                ? `${Math.abs(daysUntil)}d overdue`
                                : `Due in ${daysUntil}d`}
                            </p>
                            <p className="text-xs text-gray-600">
                              {new Date(deadline.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Recent Grades */}
            {studentData.recentGrades.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Grades</h2>
                <div className="space-y-3">
                  {studentData.recentGrades.map((submission) => {
                    const percentage = Math.round(
                      (submission.grade / submission.maxPoints) * 100
                    )

                    return (
                      <div
                        key={submission.id}
                        className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {submission.assignment.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {submission.course.title}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary-600">
                            {submission.grade}/{submission.maxPoints}
                          </p>
                          <p className="text-sm text-gray-600">{percentage}%</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}
          </div>
        )}

        {/* INSTRUCTOR/ADMIN DASHBOARD */}
        {(userRole === 'INSTRUCTOR' || userRole === 'ADMIN') && instructorData && (
          <div className="space-y-8">
            {/* My Courses */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
                <Link
                  href="/instructor"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700"
                >
                  Manage Courses
                </Link>
              </div>

              {instructorData.courses.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-600">You have not created any courses yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {instructorData.courses.map((course) => (
                    <Link
                      key={course.id}
                      href={`/instructor/courses/${course.id}/grading`}
                      className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition border border-gray-200 hover:border-primary-500"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>👥 {course._count.enrollments} students</span>
                        <span>📋 {course._count.submissions} submissions</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* Pending Grading */}
            {instructorData.pendingGrading.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Pending Grading</h2>
                <div className="space-y-3">
                  {instructorData.pendingGrading.map((pending) => (
                    <Link
                      key={pending.id}
                      href={`/instructor/courses/${pending.course.id}/grading`}
                      className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200 hover:shadow-lg transition"
                    >
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {pending.assignment.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {pending.studentName} • {pending.course.title}
                        </p>
                      </div>
                      <span className="text-amber-600 font-semibold">⚠ Grade</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
