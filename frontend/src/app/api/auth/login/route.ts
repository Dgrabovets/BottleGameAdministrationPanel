import {
  AUTH_COOKIE_NAME,
  getAdminSessionFromToken,
  getBackendApiUrl,
} from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const login = body?.login ?? body?.email;
    const password = body?.password;

    if (!login || !password) {
      return NextResponse.json(
        { error: "Логин и пароль обязательны" },
        { status: 400 },
      );
    }

    const backendResponse = await fetch(`${getBackendApiUrl()}/auth/admin-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password }),
    });

    const data = await backendResponse.json().catch(() => ({}));

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: data?.title || data?.error || "Неверные учетные данные" },
        { status: backendResponse.status },
      );
    }

    const token = data?.token ?? data?.Token;
    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Токен не получен" }, { status: 500 });
    }

    const session = getAdminSessionFromToken(token);
    if (!session) {
      return NextResponse.json({ error: "Некорректный токен" }, { status: 500 });
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
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
