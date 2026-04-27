'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const t = useTranslations()
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    const installedHandler = () => {
      setIsInstalled(true);
      setShowPrompt(false);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt && 'prompt' in deferredPrompt) {
      // @ts-ignore
      deferredPrompt.prompt();
      // @ts-ignore
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      } 
      setDeferredPrompt(null);
    }
  };

  const handleCloseClick = () => {
    setShowPrompt(false);
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg border px-4 py-2 rounded-md z-50 max-w-xs w-full">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium">{t("installPWA")} </p>
        <button onClick={handleCloseClick} className="ml-2 text-gray-500 hover:text-gray-700 text-xl leading-none">
          &times;
        </button>
      </div>
      <button
        onClick={handleInstallClick}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
      >
        {t("install_app_label")}
      </button>
    </div>
  );
}
