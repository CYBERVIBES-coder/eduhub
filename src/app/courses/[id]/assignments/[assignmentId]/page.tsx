'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Assignment {
  id: string
  title: string
  description: string | null
  dueDate: string | null
  maxPoints: number
  course: {
    id: string
    title: string
  }
}

interface Submission {
  id: string
  textContent: string | null
  fileUrl: string | null
  submittedAt: string
  grade: number | null
  feedback: string | null
  gradedAt: string | null
}

/**
 * Assignment view page - displays assignment details and submission form/status
 */
export default function AssignmentPage() {
  const params = useParams()
  const courseId = params.id as string
  const assignmentId = params.assignmentId as string

  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [textContent, setTextContent] = useState('')
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)

  useEffect(() => {
    async function fetchAssignmentAndSubmission() {
      try {
        const [assignRes, submRes] = await Promise.all([
          fetch(`/api/courses/${courseId}/assignments/${assignmentId}`),
          fetch(`/api/courses/${courseId}/assignments/${assignmentId}/my-submission`),
        ])

        if (!assignRes.ok) throw new Error('Assignment not found')
        const assignData = await assignRes.json()
        setAssignment(assignData)

        if (submRes.ok) {
          const submData = await submRes.json()
          setSubmission(submData)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAssignmentAndSubmission()
  }, [courseId, assignmentId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch(
        `/api/courses/${courseId}/assignments/${assignmentId}/submit`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ textContent }),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Submission failed')
      }

      const submData = await response.json()
      setSubmission(submData)
      setTextContent('')
      setShowSubmissionForm(false)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Submission failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading assignment...</p>
      </div>
    )
  }

  if (error || !assignment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link
              href={`/courses/${courseId}`}
              className="text-primary-600 hover:underline"
            >
              ← Back to course
            </Link>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error || 'Assignment not found'}</p>
          </div>
        </div>
      </div>
    )
  }

  const isOverdue =
    assignment.dueDate && new Date(assignment.dueDate) < new Date()
  const formattedDueDate = assignment.dueDate
    ? new Date(assignment.dueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href={`/courses/${courseId}`}
            className="text-primary-600 hover:underline text-sm"
          >
            ← Back to {assignment.course.title}
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Assignment info */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {assignment.title}
          </h1>
          {assignment.description && (
            <p className="text-gray-600 text-lg mb-6">{assignment.description}</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Max Points</p>
              <p className="text-2xl font-bold text-gray-900">{assignment.maxPoints}</p>
            </div>
            {formattedDueDate && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Due Date</p>
                <p className={`text-lg font-semibold ${
                  isOverdue ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {formattedDueDate}
                </p>
                {isOverdue && (
                  <p className="text-xs text-red-600 mt-1">Overdue</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Submission status and form */}
        {submission ? (
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Submission</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                <p className="text-lg font-semibold text-green-600">✓ Submitted</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Submitted At</p>
                <p className="text-sm text-gray-900">
                  {new Date(submission.submittedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              {submission.grade !== null && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Grade</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {submission.grade}/{assignment.maxPoints}
                  </p>
                </div>
              )}
              {submission.gradedAt && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Graded At</p>
                  <p className="text-sm text-gray-900">
                    {new Date(submission.gradedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>

            {submission.textContent && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Answer</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {submission.textContent}
                  </p>
                </div>
              </div>
            )}

            {submission.feedback && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Feedback</h3>
                <p className="text-blue-800">{submission.feedback}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Your Work</h2>

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">{submitError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="textContent"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Your Answer
                </label>
                <textarea
                  id="textContent"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  disabled={isSubmitting}
                  required
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Enter your answer here..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !textContent.trim()}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
              </button>
            </form>

            <p className="text-sm text-gray-600 mt-4">
              Once you submit, you cannot modify your answer.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
