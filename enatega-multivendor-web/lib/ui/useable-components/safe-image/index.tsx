"use client";

import { useEffect, useRef, useState } from "react";
import NextImage, { ImageProps } from "next/image";

const DIRECT_IMAGE_HOSTS = new Set(["assets.enatega.com"]);
export const FALLBACK_IMAGE_SRC = "/assets/images/png/freshGroceries.jpg";

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

function getImageKey(src: ImageProps["src"]) {
  if (typeof src === "string") return src;

  if (src && typeof src === "object" && "src" in src) {
    return src.src;
  }

  return String(src);
}

export default function Image(props: ImageProps) {
  const [imgSrc, setImgSrc] = useState(props.src);
  const latestSrcRef = useRef(props.src);

  useEffect(() => {
    latestSrcRef.current = props.src;
    setImgSrc(props.src);
  }, [props.src]);

  return (
    <NextImage
      {...props}
      key={getImageKey(imgSrc)}
      src={imgSrc}
      unoptimized={props.unoptimized ?? shouldBypassOptimization(imgSrc)}
      onError={(event) => {
        props.onError?.(event);

        if (
          imgSrc === latestSrcRef.current &&
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
