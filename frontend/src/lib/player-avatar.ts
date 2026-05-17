export const PLAYER_AVATAR_PLACEHOLDER = "/images/user/avatar-placeholder.svg";

export function resolvePlayerAvatarSrc(url?: string | null): string {
  if (!url?.trim()) {
    return PLAYER_AVATAR_PLACEHOLDER;
  }

  const trimmed = url.trim();

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return trimmed;
    }
  } catch {
    if (trimmed.startsWith("/")) {
      return trimmed;
    }
  }

  return PLAYER_AVATAR_PLACEHOLDER;
}

export function isExternalAvatarSrc(src: string): boolean {
  return src.startsWith("http://") || src.startsWith("https://");
}
