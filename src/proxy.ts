import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME } from "@/lib/booking/auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to login page
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Check admin session for all /admin routes
  if (pathname.startsWith("/admin")) {
    const sessionToken = request.cookies.get(COOKIE_NAME)?.value;
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    // Note: full token verification happens server-side
    // Proxy only checks cookie existence for optimistic redirect
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
