import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. Change `const` to `let` so we can re-assign the response if cookies are updated
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Implement the new getAll and setAll signature
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Update the request cookies so subsequent Supabase calls in this file work
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          
          // Re-create the response object to sync the state
          response = NextResponse.next({
            request,
          })
          
          // Apply the cookies to the outgoing response
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. Use getUser() instead of getSession() for secure server-side validation
  const { data: { user } } = await supabase.auth.getUser()

  // Define protected routes
  const isAuthRoute = request.nextUrl.pathname.match(/^\/(login|register|forgot-password|reset-password)/)
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard') || 
                           request.nextUrl.pathname.startsWith('/analytics') ||
                           request.nextUrl.pathname.startsWith('/team') ||
                           request.nextUrl.pathname.startsWith('/billing') ||
                           request.nextUrl.pathname.startsWith('/settings')
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isApiRoute = request.nextUrl.pathname.startsWith('/api')

  if (isApiRoute) {
    return response;
  }

  // Helper function to preserve cookies on redirect
  const redirectWithCookies = (url: URL) => {
    const redirectResponse = NextResponse.redirect(url)
    // Ensure any refreshed tokens are not lost during the redirect
    response.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })
    return redirectResponse
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && user) {
    return redirectWithCookies(new URL('/dashboard', request.url))
  }

  // Protect dashboard routes
  if ((isDashboardRoute || isAdminRoute) && !user) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return redirectWithCookies(redirectUrl)
  }

  // Admin role check
  if (isAdminRoute && user) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/organization_members?user_id=eq.${user.id}&select=role&limit=1`,
      { headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}` } }
    )
    const [row] = await res.json() as { role: string }[]
    if (!row || row.role !== 'owner') {
      return redirectWithCookies(new URL('/dashboard', request.url))
    }
  }

  // Add security headers to the final response
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/webhooks).*)',
  ],
}