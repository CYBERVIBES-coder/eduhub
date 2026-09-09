'use client'

import { Course } from '@prisma/client'
import Link from 'next/link'
import Image from 'next/image'

interface CourseCardProps {
  course: Course
}

/**
 * Course card component for displaying course in grid/list.
 * Shows course title, description, and link to detail page.
 */
export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.id}`}>
      <div className="h-full bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden border-2 border-transparent hover:border-primary-500 cursor-pointer">
        {/* Cover Image */}
        {course.coverImage ? (
          <div className="relative h-40 bg-gray-200">
            <Image
              src={course.coverImage}
              alt={course.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="h-40 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <div className="text-white text-4xl">📚</div>
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-3">
            {course.description || 'No description available'}
          </p>
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
            <span>View course</span>
            <span>→</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
