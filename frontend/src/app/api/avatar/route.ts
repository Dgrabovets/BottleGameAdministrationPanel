import {
  isPrivateOrReservedHost,
  isSafeImageContentType,
  readAvatarBody,
} from "@/lib/api-security";
import {
  getAvatarFetchUrl,
  isAllowedAvatarHop,
  normalizeAvatarUrl,
} from "@/lib/player-avatar";
import { AUTH_COOKIE_NAME } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/** Maximum number of redirects followed when fetching an avatar */
const MAX_REDIRECTS = 3;
/** Time allowed for all hops and the download of an avatar, in milliseconds */
const AVATAR_TIMEOUT_MS = 10_000;

/** Fetches an avatar and follows redirects manually, checking every hop against the host rules */
async function fetchAvatarWithRedirects(
  startUrl: string,
): Promise<Response | null> {
  let currentUrl = startUrl;
  const signal = AbortSignal.timeout(AVATAR_TIMEOUT_MS);

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const parsed = new URL(currentUrl);
    if (
      !isAllowedAvatarHop(parsed) ||
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
      // The Next data cache would read the whole body before the size cap applies
      cache: "no-store",
      signal,
    });

    if (response.status >= 300 && response.status < 400) {
      await response.body?.cancel();
      const location = response.headers.get("location");
      if (!location) return null;
      currentUrl = new URL(location, currentUrl).toString();
      continue;
    }

    return response;
  }

  return null;
}

/** Avatar proxy: downloads an allowed external image and serves it from this origin */
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

  const fetchUrl = getAvatarFetchUrl(parsed);
  if (!fetchUrl) {
    return new NextResponse(null, { status: 403 });
  }

  try {
    const upstream = await fetchAvatarWithRedirects(fetchUrl);
    if (!upstream || !upstream.ok) {
      return new NextResponse(null, { status: upstream?.status ?? 502 });
    }

    const contentType = upstream.headers.get("Content-Type");
    if (!isSafeImageContentType(contentType)) {
      return new NextResponse(null, { status: 415 });
    }

    const body = await readAvatarBody(upstream);
    if (!body) {
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
