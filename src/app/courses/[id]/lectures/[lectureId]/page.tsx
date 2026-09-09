'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

interface Attachment {
  id: string
  filename: string
  fileUrl: string
  fileType: string
}

interface Lecture {
  id: string
  title: string
  order: number
  videoUrl: string | null
  notesMarkdown: string | null
  attachments: Attachment[]
  course: {
    id: string
    title: string
  }
}

/**
 * Lecture viewer page - displays video, notes (markdown), and attachments
 */
export default function LectureViewerPage() {
  const params = useParams()
  const courseId = params.id as string
  const lectureId = params.lectureId as string

  const [lecture, setLecture] = useState<Lecture | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLecture() {
      try {
        const response = await fetch(
          `/api/courses/${courseId}/lectures/${lectureId}`
        )
        if (!response.ok) throw new Error('Lecture not found')
        const data = await response.json()
        setLecture(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }
    fetchLecture()
  }, [courseId, lectureId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading lecture...</p>
      </div>
    )
  }

  if (error || !lecture) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link
              href={`/courses/${courseId}`}
              className="text-primary-600 hover:underline"
            >
              ← Back to course
            </Link>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error || 'Lecture not found'}</p>
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
          <Link
            href={`/courses/${courseId}`}
            className="text-primary-600 hover:underline text-sm"
          >
            ← Back to {lecture.course.title}
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Lecture {lecture.order}: {lecture.title}
        </h1>
        <p className="text-gray-600 mb-8">From: {lecture.course.title}</p>

        {/* Video player */}
        {lecture.videoUrl && (
          <div className="mb-12">
            <div className="bg-black rounded-lg overflow-hidden shadow-lg mb-4">
              <video
                width="100%"
                height="auto"
                controls
                className="w-full"
              >
                <source src={lecture.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <p className="text-sm text-gray-600">Video lecture content</p>
          </div>
        )}

        {/* Attachments */}
        {lecture.attachments.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Materials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lecture.attachments.map((attachment) => (
                <a
                  key={attachment.id}
                  href={attachment.fileUrl}
                  download
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-lg transition flex items-center gap-3"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-50 rounded flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary-700">
                      {attachment.fileType.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {attachment.filename}
                    </p>
                    <p className="text-xs text-gray-500">{attachment.fileType}</p>
                  </div>
                  <span className="text-primary-600">↓</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Markdown notes */}
        {lecture.notesMarkdown && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Lecture Notes</h2>
            <div className="bg-white rounded-lg p-8 border border-gray-200 prose prose-sm max-w-none">
              <ReactMarkdown>{lecture.notesMarkdown}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!lecture.videoUrl && !lecture.notesMarkdown && lecture.attachments.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600">No content available for this lecture yet.</p>
          </div>
        )}
      </main>
    </div>
  )
}
