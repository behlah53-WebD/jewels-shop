"use client";
import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { imgs } from "@/lib/data";

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src?: string | null;
  fallbackSrc?: string;
}

function getValidImageSrc(
  src?: string | null,
  fallbackSrc: string = imgs.ring
): { url: string; unoptimized: boolean } {
  if (!src || typeof src !== "string" || src.trim() === "") {
    return { url: fallbackSrc, unoptimized: false };
  }
  const clean = src.trim();
  if (clean.startsWith("data:") || clean.startsWith("blob:")) {
    return { url: clean, unoptimized: true };
  }
  if (clean.startsWith("http://") || clean.startsWith("https://") || clean.startsWith("/")) {
    return { url: clean, unoptimized: false };
  }
  if (/^[a-zA-Z0-9_\-./]+$/.test(clean)) {
    return { url: `/${clean.replace(/^\/+/, "")}`, unoptimized: false };
  }
  return { url: fallbackSrc, unoptimized: false };
}

export function SafeImage({
  src,
  alt,
  fallbackSrc = imgs.ring,
  fill,
  width,
  height,
  className,
  priority = false,
  sizes,
  style,
  unoptimized: propUnoptimized,
  ...rest
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const targetSrc = hasError ? fallbackSrc : src;
  const { url, unoptimized: isDataOrBlob } = getValidImageSrc(targetSrc, fallbackSrc);
  const finalUnoptimized = propUnoptimized ?? isDataOrBlob;

  if (fill) {
    return (
      <Image
        src={url}
        alt={alt || "Jewellery Image"}
        fill={fill}
        priority={priority}
        sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        unoptimized={finalUnoptimized}
        className={className}
        style={style}
        onError={() => setHasError(true)}
        {...rest}
      />
    );
  }

  return (
    <Image
      src={url}
      alt={alt || "Jewellery Image"}
      width={width || 800}
      height={height || 800}
      priority={priority}
      sizes={sizes || "(max-width: 768px) 100vw, 50vw"}
      unoptimized={finalUnoptimized}
      className={className}
      style={style}
      onError={() => setHasError(true)}
      {...rest}
    />
  );
}
