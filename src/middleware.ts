import { withAuth } from 'next-auth/middleware'

/**
 * Middleware to protect routes by role and authentication.
 * Routes protected:
 * - /dashboard/* (all users)
 * - /instructor/* (INSTRUCTOR or ADMIN)
 * - /admin/* (ADMIN only)
 */
export default withAuth(
  function middleware(req) {
    const token = (req as any).nextauth.token

    // Protect /instructor routes
    if (req.nextUrl.pathname.startsWith('/instructor')) {
      if (token?.role !== 'INSTRUCTOR' && token?.role !== 'ADMIN') {
        const loginUrl = new URL('/login', req.url)
        loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
        return Response.redirect(loginUrl)
      }
    }

    // Protect /admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (token?.role !== 'ADMIN') {
        const loginUrl = new URL('/login', req.url)
        loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
        return Response.redirect(loginUrl)
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect dashboard routes
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return !!token
        }
        if (req.nextUrl.pathname.startsWith('/instructor')) {
          return !!token
        }
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return !!token
        }
        return true
      },
    },
    pages: {
      signIn: '/login',
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/instructor/:path*', '/admin/:path*'],
}
