'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface Assignment {
  id: string
  title: string
  maxPoints: number
}

interface Submission {
  id: string
  student: {
    name: string | null
    email: string
  }
  textContent: string | null
  submittedAt: string
  grade: number | null
  feedback: string | null
  assignment: Assignment
}

/**
 * Instructor grading view - grade all submissions for a course
 */
export default function GradingPage() {
  const params = useParams()
  const courseId = params.id as string
  const { data: session } = useSession()

  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingSubmissionId, setEditingSubmissionId] = useState<string | null>(null)
  const [editData, setEditData] = useState({ grade: '', feedback: '' })
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)

  const userRole = (session?.user as any)?.role

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const response = await fetch(`/api/instructor/courses/${courseId}/submissions`)
        if (!response.ok) throw new Error('Failed to fetch submissions')
        const data = await response.json()
        setSubmissions(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    if (userRole === 'INSTRUCTOR' || userRole === 'ADMIN') {
      fetchSubmissions()
    }
  }, [courseId, userRole])

  async function handleSaveGrade(
    submissionId: string,
    assignmentMaxPoints: number
  ) {
    setSaveError(null)
    setSaveSuccess(null)

    const grade = parseInt(editData.grade, 10)

    if (isNaN(grade) || grade < 0 || grade > assignmentMaxPoints) {
      setSaveError(
        `Grade must be between 0 and ${assignmentMaxPoints}`
      )
      return
    }

    try {
      const response = await fetch(
        `/api/instructor/courses/${courseId}/submissions/${submissionId}/grade`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            grade,
            feedback: editData.feedback.trim(),
          }),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save grade')
      }

      const updatedSubmission = await response.json()
      setSubmissions((prev) =>
        prev.map((s) => (s.id === submissionId ? updatedSubmission : s))
      )
      setEditingSubmissionId(null)
      setSaveSuccess('Grade saved successfully')
      setTimeout(() => setSaveSuccess(null), 3000)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save grade')
    }
  }

  function startEdit(submission: Submission) {
    setEditingSubmissionId(submission.id)
    setEditData({
      grade: submission.grade?.toString() || '',
      feedback: submission.feedback || '',
    })
    setSaveError(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading submissions...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/dashboard" className="text-primary-600 hover:underline text-sm">
                ← Back to dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">Grading</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {saveSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <p className="text-green-800">{saveSuccess}</p>
          </div>
        )}

        {submissions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600">No submissions to grade yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
              >
                {/* Submission header */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide">Student</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {submission.student.name || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-600">{submission.student.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide">Assignment</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {submission.assignment.title}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide">Submitted</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(submission.submittedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submission content */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Student Answer</h4>
                  <div className="bg-gray-50 rounded p-4 border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-wrap text-sm">
                      {submission.textContent}
                    </p>
                  </div>
                </div>

                {/* Grading form */}
                <div className="px-6 py-4">
                  {editingSubmissionId === submission.id ? (
                    <div className="space-y-4">
                      {saveError && (
                        <div className="bg-red-50 border border-red-200 rounded p-3">
                          <p className="text-red-800 text-sm">{saveError}</p>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Grade (out of {submission.assignment.maxPoints})
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={submission.assignment.maxPoints}
                          value={editData.grade}
                          onChange={(e) =>
                            setEditData({ ...editData, grade: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Feedback
                        </label>
                        <textarea
                          value={editData.feedback}
                          onChange={(e) =>
                            setEditData({ ...editData, feedback: e.target.value })
                          }
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Provide constructive feedback..."
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            handleSaveGrade(
                              submission.id,
                              submission.assignment.maxPoints
                            )
                          }
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
                        >
                          Save Grade
                        </button>
                        <button
                          onClick={() => setEditingSubmissionId(null)}
                          className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {submission.grade !== null ? (
                        <div>
                          <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-green-50 rounded border border-green-200">
                            <div>
                              <p className="text-xs text-green-600 uppercase tracking-wide">Grade</p>
                              <p className="text-2xl font-bold text-green-700">
                                {submission.grade}/{submission.assignment.maxPoints}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-green-600 uppercase tracking-wide">Graded</p>
                              <p className="text-sm text-green-700">
                                {submission.grade !== null
                                  ? 'Yes'
                                  : 'Pending'}
                              </p>
                            </div>
                          </div>

                          {submission.feedback && (
                            <div className="mb-4">
                              <p className="text-sm font-semibold text-gray-900 mb-2">
                                Feedback
                              </p>
                              <div className="bg-blue-50 p-4 rounded border border-blue-200">
                                <p className="text-blue-900 text-sm whitespace-pre-wrap">
                                  {submission.feedback}
                                </p>
                              </div>
                            </div>
                          )}

                          <button
                            onClick={() => startEdit(submission)}
                            className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition"
                          >
                            Edit Grade
                          </button>
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-gray-600 mb-4">Not yet graded</p>
                          <button
                            onClick={() => startEdit(submission)}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
                          >
                            Grade This Submission
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
