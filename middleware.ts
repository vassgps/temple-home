import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const token = request.cookies.get("next-auth.session-token")
  const secureToken = request.cookies.get("__Secure-next-auth.session-token")

  if (!token && !secureToken) {
    if (request.nextUrl.pathname.startsWith("/profile")) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    if (request.nextUrl.pathname.startsWith("/wallet")) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    if (request.nextUrl.pathname.startsWith("/add-listing")) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    if (request.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  // Also update the middleware function to explicitly allow listing pages
  if (request.nextUrl.pathname.startsWith("/listing/")) {
    return NextResponse.next()
  }
}

// Update the matcher to exclude listing detail pages
export const config = {
  matcher: [
    "/profile/:path*",
    "/wallet/:path*",
    "/add-listing/:path*",
    "/admin/:path*",
    // Remove any patterns that would match /listing/* pages
  ],
}
