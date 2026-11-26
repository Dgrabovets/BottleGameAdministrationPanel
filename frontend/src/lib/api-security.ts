import { getBackendApiUrl } from "@/lib/session";

/** Backend paths the proxy is allowed to call */
const ALLOWED_BACKEND_PATH_PATTERNS: RegExp[] = [
  /^Player\/get-all-players$/,
  /^Player\/get-top100-players$/,
  /^Player\/get-player\/\d+$/,
  /^Player\/edit-player\/\d+$/,
  /^Player\/ban-player$/,
  /^Player\/unban-player\/\d+$/,
  /^Balance\/get-all-transactions$/,
  /^Balance\/get-player-transactions\/\d+$/,
  /^Balance\/update-transaction-status\/\d+$/,
  /^Admin\/get-statistics$/,
  /^Admin\/get-statistics-timeline$/,
  /^Admin\/get-app-balance$/,
  /^Admin\/get-moderators$/,
  /^Admin\/moderator-register$/,
  /^Admin\/delete-moderator\/\d+$/,
  /^GameParams\/get-game-params$/,
  /^GameParams\/update-game-params$/,
  /^admin\/update-threshold$/,
];

/** Host name patterns of private and reserved addresses */
const PRIVATE_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^169\.254\./,
  /^0\./,
  /^::1?$/,
  /^::ffff:/i,
  /^f[cd][0-9a-f]{2}:/i,
  /^fe[89ab][0-9a-f]:/i,
];

/** Image content types that are safe to serve */
const SAFE_IMAGE_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
]);

/** Largest avatar the proxy will download, in bytes */
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

/** Checks whether a host name is a private or reserved address */
export function isPrivateOrReservedHost(hostname: string): boolean {
  // URL.hostname keeps the brackets of an IPv6 address and the trailing dot of a name
  const host = hostname.toLowerCase().replace(/^\[|\]$|\.+$/g, "");
  if (
    host === "0.0.0.0" ||
    host.endsWith(".local") ||
    host.endsWith(".localhost")
  ) {
    return true;
  }
  return PRIVATE_HOST_PATTERNS.some((pattern) => pattern.test(host));
}

/** Checks whether the proxy may forward a request to the given backend path */
export function isAllowedBackendProxyPath(path: string): boolean {
  const normalized = path.replace(/\\/g, "/").replace(/^\/+/, "");
  if (!normalized || normalized.includes("..")) return false;
  return ALLOWED_BACKEND_PATH_PATTERNS.some((pattern) =>
    pattern.test(normalized),
  );
}

/** Builds the backend URL from the path segments, or returns null when the path is not allowed */
export function buildSafeBackendUrl(pathSegments: string[]): URL | null {
  const segments = pathSegments.map((segment) => {
    try {
      return decodeURIComponent(segment);
    } catch {
      return segment;
    }
  });

  const path = segments.join("/");
  if (!isAllowedBackendProxyPath(path)) return null;

  const base = getBackendApiUrl();
  let target: URL;
  try {
    target = new URL(`${base}/${path}`);
    const baseUrl = new URL(base);
    if (target.origin !== baseUrl.origin) return null;
    // The origin is fixed by INTERNAL_API_URL, so the host check only guards against a misconfigured
    // production target. Development runs against a local API on localhost.
    if (
      process.env.NODE_ENV === "production" &&
      isPrivateOrReservedHost(target.hostname)
    ) {
      return null;
    }
  } catch {
    return null;
  }

  return target;
}

/** Checks that the content type is a safe image type */
export function isSafeImageContentType(contentType: string | null): boolean {
  if (!contentType) return false;
  const primary = contentType.split(";")[0]?.trim().toLowerCase();
  return SAFE_IMAGE_CONTENT_TYPES.has(primary);
}

/** Reads the avatar body, returns null and stops the download once it exceeds the size limit */
export async function readAvatarBody(response: Response) {
  if (Number(response.headers.get("content-length")) > MAX_AVATAR_BYTES) {
    await response.body?.cancel();
    return null;
  }

  const chunks: Uint8Array[] = [];
  let size = 0;
  const reader = response.body?.getReader();
  while (reader) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_AVATAR_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }

  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

/** Normalizes a host name for comparison */
function normalizeHost(host: string): string {
  return host.replace(/:443$/i, "").replace(/:80$/i, "").toLowerCase();
}

/** Returns the host the request was sent to */
export function getRequestHost(request: Request): string {
  return (
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    request.headers.get("host") ||
    new URL(request.url).host
  );
}

/** Checks that the request comes from the same origin */
export function isSameOriginRequest(
  request: Request,
  expectedHost: string,
): boolean {
  const expected = normalizeHost(expectedHost);
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  if (origin) {
    try {
      return normalizeHost(new URL(origin).host) === expected;
    } catch {
      return false;
    }
  }

  if (referer) {
    try {
      return normalizeHost(new URL(referer).host) === expected;
    } catch {
      return false;
    }
  }

  return true;
}

/** Login attempts per client: the count and the time when the counter resets */
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

/** Allowed login attempts per window */
const LOGIN_RATE_LIMIT = 25;
/** Length of the login rate limit window, in milliseconds */
const LOGIN_RATE_WINDOW_MS = 60 * 1000;
/** Largest number of clients the rate limit remembers */
const LOGIN_RATE_MAX_CLIENTS = 10_000;

/** Time of the next removal of expired rate limit entries */
let nextPruneAt = 0;

/** Removes expired entries once per window or when full, then the oldest one if there is still no room */
function pruneLoginAttempts(now: number) {
  if (now < nextPruneAt && loginAttempts.size < LOGIN_RATE_MAX_CLIENTS) return;
  nextPruneAt = now + LOGIN_RATE_WINDOW_MS;

  for (const [key, entry] of loginAttempts) {
    if (entry.resetAt <= now) loginAttempts.delete(key);
  }

  // shortcut: a flood of made-up client keys pushes out real counters, move to a shared store with a trusted client address
  if (loginAttempts.size >= LOGIN_RATE_MAX_CLIENTS) {
    loginAttempts.delete(loginAttempts.keys().next().value!);
  }
}

/** Counts a login attempt and tells whether it is within the limit */
export function checkLoginRateLimit(key: string): boolean {
  const now = Date.now();
  pruneLoginAttempts(now);
  const entry = loginAttempts.get(key);

  if (!entry || entry.resetAt <= now) {
    loginAttempts.set(key, {
      count: 1,
      resetAt: now + LOGIN_RATE_WINDOW_MS,
    });
    return true;
  }

  if (entry.count >= LOGIN_RATE_LIMIT) {
    return false;
  }

  entry.count += 1;
  return true;
}

/** Builds the key that identifies the client for the login rate limit */
export function getLoginRateLimitClientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
}
