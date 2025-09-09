"use client";
import { useEffect, useState, type FC } from "react";
import Link from "next/link";
import Lottie from "lottie-react";
import { useTranslations } from "next-intl";

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  actionLink?: string;
}

const EmptyState: FC<EmptyStateProps> = ({
  title,
  message,
  actionLabel,
  actionLink,
}) => {
  const t = useTranslations();
  const [animationData, setAnimationData] = useState<null | object>(null);

  useEffect(() => {
    fetch("/assets/lottie/orders.json")
      .then((res) => res.json())
      .then(setAnimationData)
      .catch((err) => console.error("Failed to load Lottie JSON", err));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-32 h-32 md:w-60 md:h-60 flex items-center justify-center">
        <Lottie animationData={animationData} loop={true} autoplay={true} />
      </div>
      <h3 className="text-xl font-semibold mb-2 dark:text-white">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md dark:text-gray-400">
        {message}
      </p>
      {actionLabel && actionLink && (
        <Link
          href={actionLink}
          className="inline-flex items-center justify-center px-6 py-3 bg-[#F3FFEE] dark:bg-gray-700 dark:hover:bg-[#5AC12F] text-black dark:text-white hover:text-white font-medium rounded-full transition-colors hover:bg-[#5AC12F] focus:outline-none focus:ring-2 focus:ring-[#5AC12F] focus:ring-offset-2"
        >
          {t("explore_store")}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
