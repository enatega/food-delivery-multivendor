import NextImage, { ImageProps } from 'next/image';

const DIRECT_IMAGE_HOSTS = new Set(['assets.enatega.com']);

function shouldBypassOptimization(src: ImageProps['src']) {
  if (typeof src !== 'string') return false;
  if (src.startsWith('blob:') || src.startsWith('data:')) return true;

  try {
    const { hostname, protocol } = new URL(src);
    return protocol === 'https:' && DIRECT_IMAGE_HOSTS.has(hostname);
  } catch {
    return false;
  }
}

export default function Image(props: ImageProps) {
  return (
    <NextImage
      {...props}
      unoptimized={props.unoptimized ?? shouldBypassOptimization(props.src)}
    />
  );
}
