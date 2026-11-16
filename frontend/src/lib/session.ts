/** Name of the cookie that holds the administrator token */
export const AUTH_COOKIE_NAME = "bottle_admin_token";

/** Administrator session built from the token */
export type AdminSession = {
  userId: string;
  userEmail: string;
  role: string;
};

/** Backend URL used in development when none is configured */
const DEV_API_URL = "http://localhost:8080/api";

/** Returns the backend API URL, required in production */
export function getBackendApiUrl(): string {
  const url =
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === "production" ? "" : DEV_API_URL);

  if (!url) {
    throw new Error(
      "INTERNAL_API_URL is not set. Point it at the Bottle Game API, for example https://api.example.com/api.",
    );
  }

  return url.replace(/\/$/, "");
}

/** Reads the payload of a JWT without verifying the signature */
export function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = Buffer.from(normalized, "base64").toString("utf-8");
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Reads a claim by its short or its long name */
function readClaim(
  decoded: Record<string, unknown>,
  ...keys: string[]
): string | null {
  for (const key of keys) {
    const value = decoded[key];
    if (typeof value === "string" && value.length > 0) return value;
    if (typeof value === "number") return String(value);
  }
  return null;
}

/** Checks whether the token has expired */
export function isTokenExpired(token: string): boolean {
  const decoded = parseJwtPayload(token);
  if (!decoded) return true;

  const exp = decoded.exp;
  if (typeof exp !== "number") return true;

  return exp <= Math.floor(Date.now() / 1000);
}

/** Builds the session from the token, or returns null when it is invalid */
export function getAdminSessionFromToken(token: string): AdminSession | null {
  if (isTokenExpired(token)) return null;

  const decoded = parseJwtPayload(token);
  if (!decoded) return null;

  const userId = readClaim(
    decoded,
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
    "sub",
  );
  const userEmail = readClaim(
    decoded,
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
    "unique_name",
    "name",
  );
  const role = readClaim(
    decoded,
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
    "role",
  );

  if (!userId || !userEmail || !role) return null;

  return { userId, userEmail, role };
}

/** Pages only an administrator may open */
export const ADMIN_ONLY_PATHS = ["/settings", "/moderators"];
