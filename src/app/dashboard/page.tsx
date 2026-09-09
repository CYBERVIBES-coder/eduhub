'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Redirect to login if not authenticated
  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  const userRole = (session?.user as any)?.role
  const userName = session?.user?.name || 'User'
  const userEmail = session?.user?.email || ''

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">{userName}</p>
              <p className="text-xs text-gray-600">{userRole}</p>
            </div>
            <form
              action={async () => {
                const { signOut } = await import('next-auth/react')
                await signOut({ redirect: true, callbackUrl: '/' })
              }}
            >
              <button
                type="submit"
                className="text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-2">
            ✓ Phase 2 Complete: Authentication
          </h2>
          <p className="text-blue-700 text-sm mb-4">
            You are signed in as <strong>{userEmail}</strong> with role <strong>{userRole}</strong>.
          </p>
          <ul className="text-sm text-blue-700 space-y-1 ml-4">
            <li>✓ NextAuth.js configured with Prisma adapter</li>
            <li>✓ Email/password registration and login</li>
            <li>✓ Role-based access control (STUDENT, INSTRUCTOR, ADMIN)</li>
            <li>✓ Protected routes with middleware</li>
            <li>✓ Session stored in JWT and database</li>
          </ul>
        </div>

        {/* Role-based content */}
        {userRole === 'ADMIN' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link
              href="/admin"
              className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition border-2 border-transparent hover:border-primary-500"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Admin Panel</h3>
              <p className="text-gray-600 text-sm">Manage users, courses, and platform settings</p>
            </Link>
          </div>
        )}

        {userRole === 'INSTRUCTOR' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link
              href="/instructor"
              className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition border-2 border-transparent hover:border-primary-500"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">My Courses</h3>
              <p className="text-gray-600 text-sm">Create and manage your courses (Phase 3+)</p>
            </Link>
          </div>
        )}

        {userRole === 'STUDENT' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link
              href="/courses"
              className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition border-2 border-transparent hover:border-primary-500"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Courses</h3>
              <p className="text-gray-600 text-sm">Explore available courses (Phase 3+)</p>
            </Link>
          </div>
        )}

        {/* Next phase info */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-amber-900 mb-2">📋 Next: Phase 3 — Course & Lecture Pages</h3>
          <p className="text-amber-700 text-sm">
            Coming next: Course catalog, course details, lecture viewer with video, notes, and attachments.
          </p>
        </div>
      </main>
    </div>
  )
}
