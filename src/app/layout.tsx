import { ErrorBoundary } from '@/components/ErrorBoundary'

/**
 * Root layout with error boundary wrapping all content
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  )
}
