"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

// Hooks
import { useConfig } from "@/lib/context/configuration/configuration.context";

// Useable components
import GoogleMapComponent from "@/lib/ui/useable-components/google-map-component";
import CustomDialog from "../custom-dialog";

// Methods and Interfaces
import {
  IInfoModalProps,
  IOpeningTime,
} from "@/lib/utils/interfaces/info.modal.interface";
import { formatTimeForHoursMins, getCurrentDay } from "@/lib/utils/methods";

const InfoModal = ({ visible, onHide, restaurantInfo }: IInfoModalProps) => {
  const [currentDay, setCurrentDay] = useState<string>("");
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 60.1699,
    lng: 24.9384,
  });

  const { GOOGLE_MAPS_KEY } = useConfig();
  const t = useTranslations();

  useEffect(() => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    console.log(restaurantInfo);
    const today = days[new Date().getDay()];
    setCurrentDay(today.slice(0, 3).toUpperCase());

    if (restaurantInfo?.location?.coordinates) {
      const [lng, lat] = restaurantInfo.location.coordinates;
      setMapCenter({ lat: +lat, lng: +lng });
    }
  }, [restaurantInfo]);

  const getFormattedHours = (day: IOpeningTime) => {
    if (day.times.length === 0) {
      return [
        <div key="closed" className="text-gray-500">
          Closed
        </div>,
      ];
    }

    return day.times.map((time, index) => {
      if (
        !time.startTime ||
        !time.startTime[0] ||
        !time.startTime[1] ||
        !time.endTime ||
        !time.endTime[0] ||
        !time.endTime[1]
      ) {
        return (
          <div key={index} className="text-red-500">
            Invalid time
          </div>
        );
      }

      const start = formatTimeForHoursMins(time.startTime);
      const end = formatTimeForHoursMins(time.endTime);
      return (
        <div key={index}>
          {start} - {end}
        </div>
      );
    });
  };

  const getCurrentDayHours = () => {
    const dayInfo = restaurantInfo?.openingTimes?.find(
      (day) => day.day === currentDay
    );
    if (!restaurantInfo?.isAvailable || !dayInfo || dayInfo.times.length === 0)
      return t("Closed");

    return dayInfo.times
      .map((time) => {
        const start = formatTimeForHoursMins(time.startTime);
        const end = formatTimeForHoursMins(time.endTime);
        return `${start}-${end}`;
      })
      .join(", ");
  };

  return (
    <CustomDialog visible={visible} onHide={onHide} className="m-0 z-[100]" width="550px">
      <div className="restaurant-info-modal">
        {/* Map */}
        <div className="relative">
          <GoogleMapComponent
            center={mapCenter}
            circleRadius={300}
            visible={visible && !!GOOGLE_MAPS_KEY}
          />
          {visible && !GOOGLE_MAPS_KEY && (
            <div className="w-full h-[360px] flex items-center justify-center bg-gray-100">
              <p>{t("MapNotAvailable")}</p>
            </div>
          )}
        </div>

        <div className="py-6 md:px-6">
          <h1 className="text-xl md:text-3xl font-bold mb-2">{restaurantInfo.name}</h1>

          <div className="flex items-center mb-4">
            <FontAwesomeIcon
              icon={faCircle}
              className={`text-[10px] md:text-xs font-normal md:text-[16px] mr-2 ${
                restaurantInfo.isAvailable && getCurrentDayHours() !== t("Closed")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            />
            <span>
              {getCurrentDay(currentDay)} {getCurrentDayHours()}
            </span>
          </div>

          <p className="mb-6 text-xs font-normal md:text-[16px]">{restaurantInfo.description}</p>

          {/* Address */}
          <div className="mb-6">
            <h2 className="text-lg md:text-xl font-bold mb-2">{t("Address")}</h2>
            <p className="mb-2 text-xs md:text-[16px] font-normal">
              {restaurantInfo.address}
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapCenter.lat},${mapCenter.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline text-xs md:text-[16px] font-normal"
            >
              {t("SeeMap")}
            </a>
          </div>

          {/* Opening Hours */}
          <div className="mb-6">
            <h2 className="text-lg md:text-xl font-bold mb-2">{t("OpeningHours")}</h2>
            <div className="grid grid-cols-1 gap-2">
              {restaurantInfo.openingTimes.map((day) => (
                <div key={day.day} className="flex justify-between items-start">
                  {/* Day Name */}
                  <div className="w-28 text-xs md:text-[16px] font-normal leading-[24px]">
                    {t(getCurrentDay(day.day))}
                  </div>

                  {/* Time Ranges with monospaced font */}
                  <div className="flex flex-col gap-[2px] text-xs md:text-[16px] font-normal leading-[24px] items-end font-inter">
                    {getFormattedHours(day)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Info */}
          <div className="mb-6">
            <h2 className="text-lg md:text-xl font-bold mb-2">{t("DeliveryInfo")}</h2>
            <div className="grid grid-cols-1 gap-2">
              <p>{t("MinOrder")} {" "}: £{restaurantInfo.MinimumOrder}</p>
              <p>{t("DeliveryTime")} {" "}: {restaurantInfo.deliveryTime} mins</p>
              <p>{t("SalesTax")} {" "}: £{restaurantInfo.deliveryTax}</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-lg md:text-xl font-bold mb-2">{t("Contact")}</h2>
            <p className="text-gray-500 text-xs md:text-[16px] font-normal">
              {t("AllergyNote")}
            </p>
            {/* Phone */}
            <div className=" flex justify-between text-xs md:text-[16px] font-normal leading-[16px] md:leading-[24px] mt-2">
              <h1 className="text-sm md:text-[16px] font-bold mb-2">
                {t("Phone")}
              </h1>
              {restaurantInfo?.phone !== "N/A" ? (
                <a
                  href={`tel:${restaurantInfo?.phone}`}
                  className="text-blue-500 hover:underline"
                >
                  {restaurantInfo?.phone}
                </a>
              ) : (
                <span className="text-gray-500">N/A</span>
              )}
            </div>
            <hr />
            <div className=" flex justify-between text-xs md:text-[16px] font-normal mt-2">
              <h1 className="text-sm md:text-[16px] font-bold mb-2">{t("Email")}</h1>
              {restaurantInfo?.username !== "N/A" ? (
                <a
                  href={`mailto:${restaurantInfo?.username || "N/A"}`}
                  className="text-blue-500 hover:underline"
                >
                  {restaurantInfo?.username}
                </a>
              ) : (
                <span className="text-gray-500">N/A</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </CustomDialog>
  );
};

export default InfoModal;
