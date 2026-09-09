'use client'

/**
 * Loading skeleton component for placeholder content
 */
export function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-12 bg-gray-200 rounded-lg"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  )
}

/**
 * Loading spinner component
 */
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  )
}

/**
 * Minimal loading state for pages
 */
export function LoadingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner />
        <p className="text-gray-600 mt-4">Loading...</p>
      </div>
    </div>
  )
}
