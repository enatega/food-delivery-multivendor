"use client";

import { useTranslations } from "next-intl";

const ComingSoon = () => {
  const t = useTranslations()
  return (
    <div className="flex h-[80vh] w-screen items-center justify-center text-3xl font-bold">
      {t('coming_soon')}
    </div>
  );
};

export default ComingSoon;
