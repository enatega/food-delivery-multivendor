"use client"
import Link from "next/link"
import Lottie from "lottie-react"
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
export default function FavoritesEmptyState() {
  const [animationData, setAnimationData] = useState<null | object>(null);
  const t = useTranslations()
  
  useEffect(() => {
    fetch("/assets/lottie/favourite.json")
      .then((res) => res.json())
      .then(setAnimationData)
      .catch((err) => console.error("Failed to load Lottie JSON", err));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-white dark:bg-gray-900 max-w-md mx-auto">
      <div className="w-32 h-32 md:w-60 md:h-60 flex items-center justify-center">
        <Lottie animationData={animationData} loop={true} autoplay={true} />
      </div>
      <h1 className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-100 mb-3 text-center">{t('no_favorites_yet')}</h1>
      <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-6 text-center">
        {t('favorites_empty_state_description')}
      </p>  
      <Link
        href="/store"
        className="inline-flex items-center justify-center px-6 py-3 bg-[#F3FFEE]  text-black hover:text-white font-medium rounded-full transition-colors hover:bg-[#5AC12F] focus:outline-none focus:ring-2 focus:ring-[#5AC12F] focus:ring-offset-2"
      >
        {t('explore_store')}
      </Link>
    </div>
  )
}