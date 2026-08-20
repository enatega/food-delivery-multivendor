const MANAGED_MEDIA_PATH = /^\/media\/[^/?#]+/i;

/**
 * Media uploaded by the API is identified by its /media path, not by the
 * deployment host that happened to return it. This keeps legacy tunnel/LAN
 * URLs usable after switching the admin between local and production APIs.
 */
export const normalizeManagedMediaUrl = (source?: string | null) => {
  if (!source) return '';

  const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  if (!backendUrl) return source;

  try {
    const configuredBackend = new URL(backendUrl);
    const parsedSource = new URL(source);
    if (!MANAGED_MEDIA_PATH.test(parsedSource.pathname)) return source;

    return new URL(
      `${parsedSource.pathname}${parsedSource.search}`,
      configuredBackend
    ).toString();
  } catch {
    const keyMatch = source.match(/^public-media\/(.+)$/i);
    return keyMatch
      ? new URL(`/media/${keyMatch[1]}`, backendUrl).toString()
      : source;
  }
};
