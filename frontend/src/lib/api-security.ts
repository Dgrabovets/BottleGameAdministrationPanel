import { getBackendApiUrl } from "@/lib/session";

const ALLOWED_BACKEND_PATH_PATTERNS: RegExp[] = [
  /^Player\/get-all-players$/,
  /^Player\/get-top100-players$/,
  /^Player\/get-player\/\d+$/,
  /^Player\/edit-player\/\d+$/,
  /^Balance\/get-all-transactions$/,
  /^Balance\/get-player-transactions\/\d+$/,
  /^Balance\/update-transaction-status\/\d+$/,
  /^Admin\/get-statistics$/,
  /^Admin\/get-app-balance$/,
  /^Admin\/get-moderators$/,
  /^Admin\/moderator-register$/,
  /^Admin\/delete-moderator\/\d+$/,
  /^GameParams\/get-game-params$/,
  /^GameParams\/update-game-params$/,
  /^admin\/update-threshold$/,
];

const PRIVATE_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^169\.254\./,
  /^0\./,
  /^::1$/,
  /^fc00:/i,
  /^fe80:/i,
];

const SAFE_IMAGE_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
]);

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

export function isPrivateOrReservedHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  if (host === "0.0.0.0" || host.endsWith(".local")) return true;
  return PRIVATE_HOST_PATTERNS.some((pattern) => pattern.test(host));
}

export function isAllowedBackendProxyPath(path: string): boolean {
  const normalized = path.replace(/\\/g, "/").replace(/^\/+/, "");
  if (!normalized || normalized.includes("..")) return false;
  return ALLOWED_BACKEND_PATH_PATTERNS.some((pattern) =>
    pattern.test(normalized),
  );
}

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
    if (isPrivateOrReservedHost(target.hostname)) return null;
  } catch {
    return null;
  }

  return target;
}

export function isSafeImageContentType(contentType: string | null): boolean {
  if (!contentType) return false;
  const primary = contentType.split(";")[0]?.trim().toLowerCase();
  return SAFE_IMAGE_CONTENT_TYPES.has(primary);
}

export function isAvatarResponseWithinSize(
  contentLength: string | null,
  body: ArrayBuffer,
): boolean {
  if (body.byteLength > MAX_AVATAR_BYTES) return false;
  if (!contentLength) return true;
  const length = Number.parseInt(contentLength, 10);
  if (Number.isNaN(length)) return true;
  return length <= MAX_AVATAR_BYTES;
}

export function isSameOriginRequest(
  request: Request,
  expectedHost: string,
): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  if (origin) {
    try {
      return new URL(origin).host === expectedHost;
    } catch {
      return false;
    }
  }

  if (referer) {
    try {
      return new URL(referer).host === expectedHost;
    } catch {
      return false;
    }
  }

  return true;
}

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

const LOGIN_RATE_LIMIT = 10;
const LOGIN_RATE_WINDOW_MS = 15 * 60 * 1000;

export function checkLoginRateLimit(key: string): boolean {
  const now = Date.now();
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

export function getLoginRateLimitClientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
}
