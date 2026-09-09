import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'

interface LectureViewerPageProps {
  params: {
    id: string
    lectureId: string
  }
}

export async function generateMetadata({ params }: LectureViewerPageProps) {
  const lecture = await prisma.lecture.findUnique({
    where: { id: params.lectureId },
    include: { course: true },
  })

  if (!lecture) {
    return { title: 'Lecture not found' }
  }

  return {
    title: `${lecture.title} - ${lecture.course.title} - EduHub`,
  }
}

/**
 * Lecture viewer page showing video, notes, and attachments.
 * Server component using Prisma to fetch lecture data.
 */
export default async function LectureViewerPage({
  params,
}: LectureViewerPageProps) {
  try {
    // Fetch lecture with course and attachments
    const lecture = await prisma.lecture.findUnique({
      where: { id: params.lectureId },
      include: {
        course: {
          select: { id: true, title: true },
        },
        attachments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!lecture) {
      notFound()
    }

    // Verify lecture belongs to correct course
    if (lecture.courseId !== params.id) {
      notFound()
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href={`/courses/${params.id}`}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium mb-4 inline-block"
            >
              ← Back to Course
            </Link>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Lecture header */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-700 rounded-full text-sm font-bold">
                {lecture.order}
              </span>
              <h1 className="text-3xl font-bold text-gray-900">{lecture.title}</h1>
            </div>
            {lecture.publishedAt && (
              <p className="text-sm text-gray-600">
                Published on {new Date(lecture.publishedAt).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Video player */}
              {lecture.videoUrl ? (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="bg-black aspect-video flex items-center justify-center">
                    {lecture.videoUrl.includes('youtube') ? (
                      <iframe
                        src={lecture.videoUrl}
                        title={lecture.title}
                        className="w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    ) : lecture.videoUrl.includes('mp4') || lecture.videoUrl.includes('webm') ? (
                      <video
                        src={lecture.videoUrl}
                        title={lecture.title}
                        controls
                        className="w-full h-full"
                      />
                    ) : (
                      <div className="text-white text-center">
                        <p className="text-2xl mb-2">🎥</p>
                        <p>Video content</p>
                        <p className="text-sm text-gray-400 mt-2">{lecture.videoUrl}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <p className="text-gray-600">No video available for this lecture</p>
                </div>
              )}

              {/* Notes */}
              {lecture.notesMarkdown && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">📝 Lecture Notes</h2>
                  <div className="prose-sm max-w-none">
                    <MarkdownRenderer markdown={lecture.notesMarkdown} />
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar: Attachments */}
            <aside className="lg:col-span-1">
              {lecture.attachments.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">📎 Materials</h3>
                  <div className="space-y-2">
                    {lecture.attachments.map((attachment) => (
                      <a
                        key={attachment.id}
                        href={attachment.fileUrl}
                        download
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded hover:bg-primary-50 transition text-sm"
                      >
                        <span className="text-lg">📄</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {attachment.filename}
                          </p>
                          <p className="text-xs text-gray-600">{attachment.fileType}</p>
                        </div>
                        <span className="text-gray-400">↓</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Related links */}
              <div className="bg-primary-50 rounded-lg border border-primary-200 p-6 mt-6">
                <h3 className="text-sm font-semibold text-primary-900 mb-3 uppercase">
                  Navigation
                </h3>
                <div className="space-y-2 text-sm">
                  <Link
                    href={`/courses/${params.id}`}
                    className="block text-primary-700 hover:text-primary-900 font-medium"
                  >
                    ← Back to Course
                  </Link>
                  <Link
                    href="/courses"
                    className="block text-primary-700 hover:text-primary-900 font-medium"
                  >
                    ← Browse All Courses
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    )
  } catch (error) {
    console.error('Error loading lecture:', error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">
            Failed to load lecture. Please try again later.
          </p>
          <Link
            href="/courses"
            className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    )
  }
}
