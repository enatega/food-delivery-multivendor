import { useTranslations } from 'next-intl';
import React from 'react';

export default function NoData({
  title,
  message,
}: {
  title?: string;
  message?: string;
}) {
  const t = useTranslations();
  return (
    <div className="w-full flex flex-col items-center justify-center p-8 text-center">
      <svg
        className="w-24 h-24 text-gray-300 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        {title ?? t('No Data Available')}
      </h3>
      <p className="text-gray-500">
        {message ?? t("There's nothing to display at the moment")}.
      </p>
    </div>
  );
}
