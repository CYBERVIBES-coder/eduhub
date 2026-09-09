import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

/**
 * Hook to fetch user's enrolled courses
 */
export function useEnrolledCourses() {
  const { data: session } = useSession()
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session?.user) return

    async function fetchEnrolledCourses() {
      try {
        const response = await fetch('/api/enrollments/my-courses')
        if (!response.ok) throw new Error('Failed to fetch enrolled courses')
        const data = await response.json()
        setCourses(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEnrolledCourses()
  }, [session?.user])

  return { courses, isLoading, error }
}
