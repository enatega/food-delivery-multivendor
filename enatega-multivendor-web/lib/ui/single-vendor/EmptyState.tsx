"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

let cachedAnimation: object | null = null;

// Illustrated empty state for single-vendor lists (search, categories, deals).
export default function SingleVendorEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}) {
  const [animationData, setAnimationData] = useState<object | null>(
    cachedAnimation,
  );

  useEffect(() => {
    if (cachedAnimation) return;
    let cancelled = false;
    fetch("/assets/lottie/no-results.json")
      .then((response) => response.json())
      .then((json) => {
        cachedAnimation = json;
        if (!cancelled) setAnimationData(json);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      role="status"
      className="mx-auto flex max-w-md flex-col items-center px-4 py-10 text-center sm:py-14"
    >
      <div
        aria-hidden
        className="flex h-40 w-40 items-center justify-center sm:h-52 sm:w-52"
      >
        {animationData ? (
          <Lottie animationData={animationData} loop autoplay />
        ) : (
          <span className="skeleton-surface h-28 w-28 animate-pulse rounded-full" />
        )}
      </div>
      <h2 className="mt-2 text-lg font-semibold text-dispatch-ink sm:text-xl dark:text-white">
        {title}
      </h2>
      {description && (
        <p className="mt-1.5 text-sm leading-relaxed text-dispatch-muted dark:text-gray-400">
          {description}
        </p>
      )}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-5 min-h-11 rounded-xl border border-dispatch-line bg-dispatch-surface px-5 text-sm font-semibold text-dispatch-ink transition-colors hover:border-primary-color hover:bg-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/60 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
