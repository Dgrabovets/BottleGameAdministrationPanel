import {
  checkLoginRateLimit,
  getLoginRateLimitClientKey,
  getRequestHost,
  isSameOriginRequest,
} from "@/lib/api-security";
import {
  AUTH_COOKIE_NAME,
  getAdminSessionFromToken,
  getBackendApiUrl,
} from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

/** Logs the administrator in: checks the credentials against the backend and sets the session cookie */
export async function POST(request: NextRequest) {
  try {
    const host = getRequestHost(request);
    if (!isSameOriginRequest(request, host)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const clientKey = getLoginRateLimitClientKey(request);
    if (!checkLoginRateLimit(clientKey)) {
      return NextResponse.json(
        { error: "Too many attempts. Try again later" },
        { status: 429 },
      );
    }

    const body = await request.json();
    const login = body?.login ?? body?.email;
    const password = body?.password;

    if (
      !login ||
      !password ||
      typeof login !== "string" ||
      typeof password !== "string"
    ) {
      return NextResponse.json(
        { error: "Login and password are required" },
        { status: 400 },
      );
    }

    if (login.length > 256 || password.length > 256) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const backendResponse = await fetch(
      `${getBackendApiUrl()}/auth/admin-login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
        redirect: "error",
      },
    );

    const data = await backendResponse.json().catch(() => ({}));

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const token = data?.token ?? data?.Token;
    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Token was not received" },
        { status: 500 },
      );
    }

    const session = getAdminSessionFromToken(token);
    if (!session) {
      return NextResponse.json({ error: "Invalid token" }, { status: 500 });
    }

    const response = NextResponse.json({ session });
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
