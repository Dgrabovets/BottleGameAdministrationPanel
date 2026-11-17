import {
  buildSafeBackendUrl,
  getRequestHost,
  isSameOriginRequest,
} from "@/lib/api-security";
import { AUTH_COOKIE_NAME } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/** Forwards a request to the backend API after checking the path and the origin */
async function proxyRequest(
  request: NextRequest,
  pathSegments: string[],
): Promise<NextResponse> {
  // The cookie is sameSite=lax, this check is a second line of defense for requests that change data
  const changesData = request.method !== "GET" && request.method !== "HEAD";
  if (changesData && !isSameOriginRequest(request, getRequestHost(request))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const targetUrl = buildSafeBackendUrl(pathSegments);
  if (!targetUrl) {
    return NextResponse.json({ error: "Forbidden path" }, { status: 403 });
  }

  targetUrl.search = request.nextUrl.search;

  const headers = new Headers();
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Accept", "application/json");

  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: "error",
    // A hung API must not keep the server request open for ever
    signal: AbortSignal.timeout(15_000),
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  try {
    const backendResponse = await fetch(targetUrl, init);
    const responseBody = await backendResponse.text();

    const responseHeaders: Record<string, string> = {
      "Content-Type":
        backendResponse.headers.get("Content-Type") || "application/json",
    };

    // The size of the whole list when the page was asked for
    const totalCount = backendResponse.headers.get("X-Total-Count");
    if (totalCount) {
      responseHeaders["X-Total-Count"] = totalCount;
    }

    return new NextResponse(responseBody, {
      status: backendResponse.status,
      headers: responseHeaders,
    });
  } catch {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 502 });
  }
}

/** Route context with the path segments after /api/backend */
type RouteContext = {
  params: Promise<{ path: string[] }>;
};

/** Proxies GET requests to the backend API */
export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

/** Proxies POST requests to the backend API */
export async function POST(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

/** Proxies PUT requests to the backend API */
export async function PUT(request: NextRequest, context: RouteContext) {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

/** Proxies PATCH requests to the backend API */
export async function PATCH(request: NextRequest, context: RouteContext) {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

/** Proxies DELETE requests to the backend API */
export async function DELETE(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}
