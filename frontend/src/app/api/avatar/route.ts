import {
  isAvatarResponseWithinSize,
  isPrivateOrReservedHost,
  isSafeImageContentType,
} from "@/lib/api-security";
import {
  isAllowedAvatarHost,
  normalizeAvatarUrl,
} from "@/lib/player-avatar";
import { AUTH_COOKIE_NAME } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const MAX_REDIRECTS = 3;

async function fetchAvatarWithRedirects(
  startUrl: string,
): Promise<Response | null> {
  let currentUrl = startUrl;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const parsed = new URL(currentUrl);
    if (
      !isAllowedAvatarHost(parsed.hostname) ||
      isPrivateOrReservedHost(parsed.hostname)
    ) {
      return null;
    }

    const response = await fetch(currentUrl, {
      headers: {
        Accept: "image/*",
        "User-Agent": "Mozilla/5.0 (compatible; BottleAdmin/1.0)",
      },
      redirect: "manual",
      next: { revalidate: 3600 },
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) return null;
      currentUrl = new URL(location, currentUrl).toString();
      continue;
    }

    return response;
  }

  return null;
}

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

  if (
    !isAllowedAvatarHost(parsed.hostname) ||
    isPrivateOrReservedHost(parsed.hostname)
  ) {
    return new NextResponse(null, { status: 403 });
  }

  try {
    const upstream = await fetchAvatarWithRedirects(normalized);
    if (!upstream || !upstream.ok) {
      return new NextResponse(null, { status: upstream?.status ?? 502 });
    }

    const contentType = upstream.headers.get("Content-Type");
    if (!isSafeImageContentType(contentType)) {
      return new NextResponse(null, { status: 415 });
    }

    const body = await upstream.arrayBuffer();
    if (
      !isAvatarResponseWithinSize(upstream.headers.get("Content-Length"), body)
    ) {
      return new NextResponse(null, { status: 413 });
    }

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType!.split(";")[0],
        "Cache-Control": "private, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
