const MANAGED_MEDIA_PATH = /^\/media\/[^/?#]+/i;
const PUBLIC_MEDIA_PATH = /^public-media\/(.+)$/i;
const ABSOLUTE_MEDIA_URL = /^(https?:|data:|blob:)/i;
const DOMAIN_LIKE_MEDIA_URL = /^[a-z0-9.-]+\.[a-z]{2,}(?:\/|$|\?)/i;

function joinWithBase(path: string, baseUrl: string) {
  try {
    return new URL(path, baseUrl).toString();
  } catch {
    return path;
  }
}

/**
 * Converts API media references into a source accepted by next/image.
 *
 * The API's `public-media/<key>` representation maps to its `/media/<key>`
 * endpoint. Rich client state may retain that API value; only the rendering
 * boundary turns it into the URL for the currently active vendor mode.
 */
export function normalizeMediaUrl(source: string, baseUrl = "") {
  const trimmed = source.trim();
  if (!trimmed) return trimmed;

  const publicMediaMatch = trimmed.match(PUBLIC_MEDIA_PATH);
  if (publicMediaMatch) {
    const managedPath = `/media/${publicMediaMatch[1]}`;
    return baseUrl ? joinWithBase(managedPath, baseUrl) : managedPath;
  }

  if (ABSOLUTE_MEDIA_URL.test(trimmed)) {
    if (!baseUrl || !/^https?:/i.test(trimmed)) return trimmed;

    try {
      const parsedSource = new URL(trimmed);
      if (!MANAGED_MEDIA_PATH.test(parsedSource.pathname)) return trimmed;

      return joinWithBase(
        `${parsedSource.pathname}${parsedSource.search}`,
        baseUrl,
      );
    } catch {
      return trimmed;
    }
  }

  if (DOMAIN_LIKE_MEDIA_URL.test(trimmed)) return `https://${trimmed}`;

  if (MANAGED_MEDIA_PATH.test(trimmed) && baseUrl) {
    return joinWithBase(trimmed, baseUrl);
  }

  if (trimmed.startsWith("/")) return trimmed;

  return baseUrl
    ? joinWithBase(trimmed, baseUrl)
    : `/${trimmed.replace(/^\/+/, "")}`;
}
