"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import NextImage, { ImageProps } from "next/image";
import { getModeEnvironment, useAppMode } from "@/lib/mode";
import { normalizeMediaUrl } from "@/lib/utils/media-url";

export const FALLBACK_IMAGE_SRC = "/assets/images/png/freshGroceries.jpg";

function shouldBypassOptimization(src: ImageProps["src"]) {
  return (
    typeof src === "string" &&
    (src.startsWith("blob:") || src.startsWith("data:"))
  );
}

function getImageKey(src: ImageProps["src"]) {
  if (typeof src === "string") return src;

  if (src && typeof src === "object" && "src" in src) {
    return src.src;
  }

  return String(src);
}

export default function Image(props: ImageProps) {
  const { mode } = useAppMode();
  const mediaBaseUrl = getModeEnvironment(mode).restUrl;
  const source = useMemo(
    () =>
      typeof props.src === "string"
        ? normalizeMediaUrl(props.src, mediaBaseUrl)
        : props.src,
    [mediaBaseUrl, props.src],
  );
  const [imgSrc, setImgSrc] = useState(source);
  const latestSrcRef = useRef(source);

  useEffect(() => {
    latestSrcRef.current = source;
    setImgSrc(source);
  }, [source]);

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
