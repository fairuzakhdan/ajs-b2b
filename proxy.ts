import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Proteksi route buyer & admin di level proxy (Edge Runtime).
// Pengecekan di sini hanya validasi keberadaan & keabsahan session +
// role yang sesuai. Logic bisnis granular tetap ada di masing-masing
// Server Component/Action.
//
// Next.js 16: konvensi `middleware` sudah di-rename menjadi `proxy`.

const SESSION_COOKIE_NAME = "ajs_session";

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET belum di-set di environment variables (.env)."
    );
  }
  return new TextEncoder().encode(secret);
}

async function getSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return {
      userId: payload.userId as string,
      role: payload.role as "BUYER" | "ADMIN",
      email: payload.email as string,
    };
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSessionFromRequest(request);

  const isBuyerRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/cart") ||
    pathname.startsWith("/orders");
  const isAdminRoute = pathname.startsWith("/admin");

  if (isBuyerRoute) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (session.role !== "BUYER") {
      // admin yang nyasar ke route buyer -> arahkan ke area admin
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  if (isAdminRoute) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (session.role !== "ADMIN") {
      // buyer yang nyasar ke route admin -> arahkan ke dashboard buyer
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/cart/:path*", "/orders/:path*", "/admin/:path*"],
};
