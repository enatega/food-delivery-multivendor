"use client"
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Tooltip } from "react-tooltip";
import CustomButton from "../button";
import { useTranslations } from "use-intl";

const MapViewButton: React.FC = () => {
  const t = useTranslations()
  const pathname = usePathname();

  const showMapViewButton = pathname === "/restaurants" || pathname === "/store";

  return (
    showMapViewButton ? (
      <div className="flex items-center gap-2 ">
        <Link href={`/mapview${pathname}`}>
        <CustomButton
              label={t("map_view")}
              className="text-sky-500 transition-colors duration-200 text-sm md:text-base hidden sm:block"
            />
        </Link>
        <Link
          href={`/mapview${pathname}`}
          className="bg-white hover:bg-gray-100 transition-colors duration-200 text-gray-900 rounded-full p-2 flex items-center justify-center shadow-md"
          data-tooltip-id="view-on-map"
          data-tooltip-content={`View ${pathname
            .charAt(1)
            .toUpperCase()}${pathname.slice(2)} on Map`}
        >
          <i className="pi pi-map" style={{ fontSize: "1rem" }}></i>
          <Tooltip id="view-on-map" />
        </Link>
      </div>
    ) : ''
  );
};

export default MapViewButton;