import LoginForm from '@/components/LoginForm'
import Link from 'next/link'

export const metadata = {
  title: 'Sign In - EduHub',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="text-2xl font-bold text-primary-700 hover:text-primary-800">
              EduHub
            </Link>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          {/* Form */}
          <LoginForm />

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500">
              Protected by NextAuth.js • Password hashed with bcryptjs
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
