import { withAuth } from 'next-auth/middleware'
import { NextRequest } from 'next/server'

/**
 * Middleware to protect routes by role.
 * Use in middleware.ts to restrict access.
 */
export function createAuthMiddleware() {
  return withAuth(
    function middleware(req: NextRequest) {
      const token = (req as any).nextauth.token

      // Protect /instructor routes (require INSTRUCTOR or ADMIN)
      if (req.nextUrl.pathname.startsWith('/instructor')) {
        if (token?.role !== 'INSTRUCTOR' && token?.role !== 'ADMIN') {
          return new Response('Unauthorized', { status: 403 })
        }
      }

      // Protect /admin routes (require ADMIN only)
      if (req.nextUrl.pathname.startsWith('/admin')) {
        if (token?.role !== 'ADMIN') {
          return new Response('Unauthorized', { status: 403 })
        }
      }

      // Protect /dashboard (require any authenticated user)
      if (req.nextUrl.pathname.startsWith('/dashboard')) {
        if (!token) {
          return new Response('Unauthorized', { status: 403 })
        }
      }
    },
    {
      callbacks: {
        authorized: ({ token }) => {
          // Redirect to login if not authenticated
          return !!token
        },
      },
      pages: {
        signIn: '/login',
      },
    }
  )
}
