'use client'

import { FormEvent, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface LoginError {
  field: string
  message: string
}

/**
 * Login form component with email/password fields.
 * Submits to NextAuth credentials provider.
 */
export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<LoginError[]>([])
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors([])
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setErrors([{ field: 'form', message: result.error }])
      } else if (result?.ok) {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      setErrors([{ field: 'form', message: 'An error occurred. Please try again.' }])
    } finally {
      setIsLoading(false)
    }
  }

  const formErrors = errors.find((e) => e.field === 'form')
  const emailError = errors.find((e) => e.field === 'email')
  const passwordError = errors.find((e) => e.field === 'password')

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formErrors && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{formErrors.message}</p>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-900">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
          className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
          placeholder="user@example.com"
        />
        {emailError && (
          <p className="mt-1 text-sm text-red-600">{emailError.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-900">
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
          className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
          placeholder="••••••••"
        />
        {passwordError && (
          <p className="mt-1 text-sm text-red-600">{passwordError.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>

      <p className="text-center text-gray-600 text-sm">
        Don't have an account?{' '}
        <Link href="/register" className="text-primary-600 hover:underline font-semibold">
          Register here
        </Link>
      </p>
    </form>
  )
}
