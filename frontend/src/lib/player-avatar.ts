export const PLAYER_AVATAR_PLACEHOLDER = "/images/user/avatar-placeholder.svg";

const ALLOWED_AVATAR_HOST_SUFFIXES = [
  "t.me",
  "telegram.org",
  "telesco.pe",
  "telegram-cdn.org",
];

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

export function isAllowedAvatarHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return ALLOWED_AVATAR_HOST_SUFFIXES.some(
    (suffix) => host === suffix || host.endsWith(`.${suffix}`),
  );
}

export function getProxiedAvatarUrl(externalUrl: string): string {
  return `/api/avatar?url=${encodeURIComponent(externalUrl)}`;
}

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

/** Достаёт URL аватара из ответа API (camelCase или PascalCase). */
export function getPlayerAvatarUrl(
  player?: { avatarUrl?: string; AvatarUrl?: string } | null,
): string | undefined {
  if (!player) return undefined;
  return player.avatarUrl?.trim() || player.AvatarUrl?.trim() || undefined;
}
