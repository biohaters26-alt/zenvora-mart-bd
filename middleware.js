import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = process.env.COOKIE_NAME || "zenvora_token";
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

// Note: uses `jose` (not `jsonwebtoken`) because Next.js middleware runs on
// the Edge runtime, which does not support Node's `crypto` module.
export async function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login?redirect=/admin", req.url));
    }

    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch (err) {
      return NextResponse.redirect(new URL("/login?redirect=/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
