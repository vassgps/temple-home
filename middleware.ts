import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const token = request.cookies.get("next-auth.session-token")
  const { pathname } = request.nextUrl

  // Make sure /listing/* paths are excluded from authentication
  const publicPaths = [
    "/",
    "/about",
    "/contact",
    "/search",
    "/listing", // Add this to make all listing pages public
    "/thank-you",
    "/offline",
  ]

  // Update the matcher to exclude listing pages
  if (publicPaths.some((path) => pathname.startsWith(path)) || pathname.includes("/listing/")) {
    return NextResponse.next()
  }

  if (!token && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
