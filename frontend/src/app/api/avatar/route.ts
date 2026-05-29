import { AUTH_COOKIE_NAME } from "@/lib/session";
import {
  isAllowedAvatarHost,
  normalizeAvatarUrl,
} from "@/lib/player-avatar";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return new NextResponse(null, { status: 401 });
  }

  const rawUrl = request.nextUrl.searchParams.get("url");
  const normalized = normalizeAvatarUrl(rawUrl);

  if (!normalized || normalized.startsWith("/")) {
    return new NextResponse(null, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  if (!isAllowedAvatarHost(parsed.hostname)) {
    return new NextResponse(null, { status: 403 });
  }

  try {
    const upstream = await fetch(normalized, {
      headers: {
        Accept: "image/*",
        "User-Agent": "Mozilla/5.0 (compatible; BottleAdmin/1.0)",
      },
      next: { revalidate: 3600 },
    });

    if (!upstream.ok) {
      return new NextResponse(null, { status: upstream.status });
    }

    const contentType =
      upstream.headers.get("Content-Type") || "image/jpeg";
    const body = await upstream.arrayBuffer();

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
