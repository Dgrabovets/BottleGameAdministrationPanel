/** Placeholder image shown when a player has no avatar */
export const PLAYER_AVATAR_PLACEHOLDER = "/images/user/avatar-placeholder.svg";

/** Host suffixes avatars may be loaded from */
const ALLOWED_AVATAR_HOST_SUFFIXES = [
  "t.me",
  "telegram.org",
  "telesco.pe",
  "telegram-cdn.org",
];

/** Normalizes an avatar URL, returns null when it is empty or not a valid URL */
export function normalizeAvatarUrl(url?: string | null): string | null {
  if (!url?.trim()) return null;

  let trimmed = url.trim();

  if (trimmed.startsWith("//")) {
    trimmed = `https:${trimmed}`;
  }

  if (!/^https?:\/\//i.test(trimmed)) {
    if (trimmed.startsWith("t.me/")) {
      trimmed = `https://${trimmed}`;
    } else if (trimmed.startsWith("/")) {
      return trimmed;
    } else {
      return null;
    }
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

/** Checks that the avatar host is on the allowed list */
export function isAllowedAvatarHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return ALLOWED_AVATAR_HOST_SUFFIXES.some(
    (suffix) => host === suffix || host.endsWith(`.${suffix}`),
  );
}

/** Returns the URL of an avatar through the proxy of this app */
export function getProxiedAvatarUrl(externalUrl: string): string {
  return `/api/avatar?url=${encodeURIComponent(externalUrl)}`;
}

/** Returns the avatar source to show: the proxied URL or the placeholder */
export function resolvePlayerAvatarSrc(url?: string | null): string {
  const normalized = normalizeAvatarUrl(url);

  if (!normalized) {
    return PLAYER_AVATAR_PLACEHOLDER;
  }

  if (normalized.startsWith("/")) {
    return normalized;
  }

  try {
    const parsed = new URL(normalized);
    if (isAllowedAvatarHost(parsed.hostname)) {
      return getProxiedAvatarUrl(normalized);
    }
  } catch {
    return PLAYER_AVATAR_PLACEHOLDER;
  }

  return PLAYER_AVATAR_PLACEHOLDER;
}

/** Extracts the avatar URL from the API response (camelCase or PascalCase) */
export function getPlayerAvatarUrl(
  player?: { avatarUrl?: string; AvatarUrl?: string } | null,
): string | undefined {
  if (!player) return undefined;
  return player.avatarUrl?.trim() || player.AvatarUrl?.trim() || undefined;
}
