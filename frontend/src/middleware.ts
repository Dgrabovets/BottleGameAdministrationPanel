import {
  ADMIN_ONLY_PATHS,
  AUTH_COOKIE_NAME,
  getAdminSessionFromToken,
} from "@/lib/session";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/logout"];
const PUBLIC_API_PREFIXES = ["/api/auth/login"];

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/favicon") ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$/i.test(pathname)
  );
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  if (PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/auth/logout")) {
    return NextResponse.next();
  }

  if (
    (pathname.startsWith("/api/backend") ||
      pathname.startsWith("/api/avatar")) &&
    !token
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isPublicPage = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (token && isPublicPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!token && !isPublicPage && !pathname.startsWith("/api/")) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && ADMIN_ONLY_PATHS.some((path) => pathname.startsWith(path))) {
    const session = getAdminSessionFromToken(token);
    if (!session || session.role !== "Admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
