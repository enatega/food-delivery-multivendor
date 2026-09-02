"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "use-intl";

const MapViewButton: React.FC = () => {
  const t = useTranslations();
  const pathname = usePathname();

  const showMapViewButton =
    pathname === "/restaurants" || pathname === "/store";

  if (!showMapViewButton) return null;

  return (
    <Link
      href={`/mapview${pathname}`}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-dispatch-map px-3.5 text-sm font-medium text-dispatch-ink transition-colors hover:bg-primary-light hover:text-primary-dark focus-visible:outline-none dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
    >
      <i className="pi pi-map text-sm" aria-hidden />
      <span className="hidden sm:inline">{t("map_view")}</span>
      <span className="sr-only sm:hidden">{t("map_view")}</span>
    </Link>
  );
};

export default MapViewButton;
