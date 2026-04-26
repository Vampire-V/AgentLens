import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Only process root path with yaml query parameter
  if (request.nextUrl.pathname === '/' && request.nextUrl.searchParams.has('yaml')) {
    // Preserve all query parameters when redirecting to /app
    const appUrl = new URL(request.url)
    appUrl.pathname = '/app'
    return NextResponse.redirect(appUrl, 301)
  }

  // All other cases: pass through (landing page at /)
  return NextResponse.next()
}

export const config = {
  matcher: ['/'],
}
