import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  // console.log("middleware");
  // const token = req.cookies.get("access_token")?.value;
  // console.log(token, "Token Middleware");
  // const isAuthPage = req.nextUrl.pathname.startsWith("/login");
  // const isProtectedPage = [
  //   "/",
  //   "/players",
  //   "/withdraws",
  //   "/deposits",
  //   "/profile",
  //   "/top-players",
  //   "/settings",
  //   "/account/settings",
  // ].includes(req.nextUrl.pathname);
  // if (token && isAuthPage) {
  //   return NextResponse.redirect(new URL("/", req.url)); // Не пускаем авторизованных на логин
  // }
  // if (!token && isProtectedPage) {
  //   return NextResponse.redirect(new URL("/login", req.url)); // Редирект если нет токена
  // }
  // return NextResponse.next();
}

// Указываем, на какие страницы применяется middleware
export const config = {
  matcher: ["/:path*"], // Проверять все страницы внутри /dashboard
};
