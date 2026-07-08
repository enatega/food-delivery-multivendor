"use client";

import { useEffect, useState } from "react";
import NextImage, { ImageProps } from "next/image";

const DIRECT_IMAGE_HOSTS = new Set(["assets.enatega.com"]);
const FALLBACK_IMAGE_SRC = "/assets/images/png/freshGroceries.jpg";

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
  const [imgSrc, setImgSrc] = useState(props.src);

  useEffect(() => {
    setImgSrc(props.src);
  }, [props.src]);

  return (
    <NextImage
      {...props}
      src={imgSrc}
      unoptimized={props.unoptimized ?? shouldBypassOptimization(imgSrc)}
      onError={(event) => {
        props.onError?.(event);

        if (
          typeof imgSrc === "string" &&
          imgSrc !== FALLBACK_IMAGE_SRC &&
          !imgSrc.startsWith("blob:") &&
          !imgSrc.startsWith("data:")
        ) {
          setImgSrc(FALLBACK_IMAGE_SRC);
        }
      }}
    />
  );
}
