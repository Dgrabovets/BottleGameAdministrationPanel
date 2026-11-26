/** Placeholder image shown when a player has no avatar */
export const PLAYER_AVATAR_PLACEHOLDER = "/images/user/avatar-placeholder.svg";

/** Host suffixes an avatar may be fetched from, redirects to the Telegram CDN included */
const ALLOWED_AVATAR_HOST_SUFFIXES = ["t.me", "telegram.org", "telesco.pe"];

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

/**
 * Returns the address to fetch for an avatar link, rebuilt on a fixed origin so the link cannot choose the host.
 * Returns null when the link points anywhere else
 */
export function getAvatarFetchUrl(link: URL): string | null {
  // The literal host and slash come first, so a path such as //other.host stays a path
  const path = `${link.pathname.slice(1)}${link.search}`;
  switch (link.origin) {
    case "https://t.me":
      return `https://t.me/${path}`;
    case "https://telegram.org":
      return `https://telegram.org/${path}`;
    default:
      return null;
  }
}

/** Checks a hop before it is fetched: HTTPS on the default port from an allowed host */
export function isAllowedAvatarHop(url: URL): boolean {
  const host = url.hostname.toLowerCase();
  return (
    url.protocol === "https:" &&
    !url.port &&
    ALLOWED_AVATAR_HOST_SUFFIXES.some(
      (suffix) => host === suffix || host.endsWith(`.${suffix}`),
    )
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
    if (getAvatarFetchUrl(new URL(normalized))) {
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
