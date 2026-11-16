import { AUTH_COOKIE_NAME, getAdminSessionFromToken } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/** Returns the current administrator session, or 401 when there is none */
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = getAdminSessionFromToken(token);
  if (!session) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  return NextResponse.json({ session });
}
