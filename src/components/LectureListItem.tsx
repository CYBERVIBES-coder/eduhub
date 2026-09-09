'use client'

import { Lecture } from '@prisma/client'
import Link from 'next/link'

interface LectureListItemProps {
  lecture: Lecture & { _count?: { attachments: number } }
  courseId: string
}

/**
 * Lecture list item for course detail page.
 * Shows lecture title, order, and link to viewer.
 */
export function LectureListItem({ lecture, courseId }: LectureListItemProps) {
  const hasVideo = !!lecture.videoUrl
  const hasNotes = !!lecture.notesMarkdown
  const attachmentCount = lecture._count?.attachments || 0

  return (
    <Link href={`/courses/${courseId}/lectures/${lecture.id}`}>
      <div className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition cursor-pointer">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center w-7 h-7 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                {lecture.order}
              </span>
              <h3 className="text-lg font-semibold text-gray-900">{lecture.title}</h3>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-gray-600 ml-10">
              {hasVideo && (
                <span className="flex items-center gap-1">
                  <span>🎥</span> Video
                </span>
              )}
              {hasNotes && (
                <span className="flex items-center gap-1">
                  <span>📝</span> Notes
                </span>
              )}
              {attachmentCount > 0 && (
                <span className="flex items-center gap-1">
                  <span>📎</span> {attachmentCount} file{attachmentCount !== 1 ? 's' : ''}
                </span>
              )}
              {!hasVideo && !hasNotes && attachmentCount === 0 && (
                <span className="text-gray-400">No materials yet</span>
              )}
            </div>
          </div>
          <div className="text-primary-600 text-lg ml-4">→</div>
        </div>
      </div>
    </Link>
  )
}
