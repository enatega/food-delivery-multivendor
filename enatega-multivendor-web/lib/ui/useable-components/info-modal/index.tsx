"use client";
import { useEffect, useState } from "react";
//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
//Hooks
import { useConfig } from "@/lib/context/configuration/configuration.context";
//useable components
import GoogleMapComponent from "@/lib/ui/useable-components/google-map-component";
import CustomDialog from "../custom-dialog";
//Methods
import {
  IInfoModalProps,
  IOpeningTime,
} from "@/lib/utils/interfaces/info.modal.interface";
import { formatTimeForHoursMins, getCurrentDay } from "@/lib/utils/methods";

/**
 * InfoModal Component
 *
 * Displays detailed information about a restaurant in a modal dialog
 * Including location map, hours, address and delivery information
 */
const InfoModal = ({ visible, onHide, restaurantInfo }: IInfoModalProps) => {
  // State declarations
  const [currentDay, setCurrentDay] = useState<string>("");
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 60.1699,
    lng: 24.9384, // Default to Helsinki
  });

  // Configuration hooks
  const { GOOGLE_MAPS_KEY } = useConfig();

  // UseEffects

  /**
   * Effect to initialize current day and map center coordinates
   * Runs when restaurant information changes
   */
  useEffect(() => {
    // Set current day
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const today = days[new Date().getDay()];
    // Convert day format from "Monday" to "MON"
    setCurrentDay(today.slice(0, 3).toUpperCase());

    // Set map center if coordinates are available
    if (restaurantInfo?.location?.coordinates) {
      const [lng, lat] = restaurantInfo.location.coordinates;
      setMapCenter({
        lat: Number.parseFloat(lat),
        lng: Number.parseFloat(lng),
      });
    }
  }, [restaurantInfo]);

  // Helper Methods

  /**
   * Formats opening hours for a given day
   * @param day - The opening time data for a specific day
   * @returns Formatted string representing hours or "Closed" if no times available
   */
  const getFormattedHours = (day: IOpeningTime) => {
    if (day.times.length === 0) return "Closed";

    return day.times
      .map((time) => {
        // Validate time arrays before formatting
        if (
          !time.startTime ||
          !time.startTime[0] ||
          !time.startTime[1] ||
          !time.endTime ||
          !time.endTime[0] ||
          !time.endTime[1]
        ) {
          return "Invalid time";
        }
        const start = formatTimeForHoursMins(time.startTime);
        const end = formatTimeForHoursMins(time.endTime);
        return `${start}-${end}`;
      })
      .join("\n");
  };

  /**
   * Gets the current day's opening hours for display in the header
   * @returns Formatted string of today's hours or "Closed" if not available
   */
  const getCurrentDayHours = () => {
    const dayInfo = restaurantInfo?.openingTimes?.find(
      (day) => day.day === currentDay
    );
    if (!restaurantInfo?.isAvailable || !dayInfo || dayInfo.times.length === 0)
      return "Closed";

    return dayInfo.times
      .map((time) => {
        const start = formatTimeForHoursMins(time.startTime);
        const end = formatTimeForHoursMins(time.endTime);
        return `${start}-${end}`;
      })
      .join(", ");
  };

  return (
    <CustomDialog
      visible={visible}
      onHide={onHide}
      className="m-0 z-[100]"
      width="550px"
    >
      <div className="restaurant-info-modal">
        {/* Google Map Section - Shows restaurant location */}
        <div className="relative">
          <GoogleMapComponent
            center={mapCenter}
            circleRadius={300}
            visible={visible && !!GOOGLE_MAPS_KEY}
          />
          {visible && !GOOGLE_MAPS_KEY && (
            <div className="w-full h-[360px] flex items-center justify-center bg-gray-100">
              <p>Map not available</p>
            </div>
          )}
        </div>

        {/* Restaurant Information Section */}
        <div className="py-6 md:px-6">
          {/* Restaurant Name Header */}
          <h1 className="text-xl md:text-3xl font-bold mb-2">
            {restaurantInfo.name}
          </h1>

          {/* Current Operating Status - Green for open, Red for closed */}
          <div className="flex items-center mb-4">
            <FontAwesomeIcon
              icon={faCircle}
              className={`text-[10px] md:text-xs font-normal md:text-[16px] mr-2 ${restaurantInfo.isAvailable && getCurrentDayHours() !== "Closed" ? "text-green-500" : "text-red-500"}`}
            />
            <span>
              {getCurrentDay(currentDay)} {getCurrentDayHours()}
            </span>
          </div>

          {/* Restaurant Description */}
          <p className="mb-6 text-xs font-normal md:text-[16px]">
            {restaurantInfo.description}
          </p>

          {/* Address Section with Google Maps link */}
          <div className="mb-6">
            <h2 className="text-lg md:text-xl font-bold mb-2">Address</h2>
            <p className="mb-2 text-xs md:text-[16px] font-normal">
              {restaurantInfo.address}
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapCenter.lat},${mapCenter.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline text-xs md:text-[16px] font-normal"
            >
              See Map
            </a>
          </div>

          {/* Opening Times Section - Lists hours for each day of the week */}
          <div className="mb-6">
            <h2 className="text-lg md:text-xl font-bold mb-2">Opening Hours</h2>
            <div className="grid grid-cols-1 gap-2">
              {restaurantInfo.openingTimes.map((day) => (
                <div
                  key={day.day}
                  className="flex justify-between text-xs md:text-[16px] font-normal leading-[16px] md:leading-[24px]"
                >
                  <span>{getCurrentDay(day.day)}</span>
                  <span className="whitespace-pre-line">{getFormattedHours(day)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Information Section - Shows delivery hours by day */}
          <div className="mb-6">
            <h2 className="text-lg md:text-xl font-bold mb-2">
              Delivery information
            </h2>
            <div className="grid grid-cols-1 gap-2">
              <p>Minimum Order: {" "}£{restaurantInfo.MinimumOrder}</p>
              <p>Delivery Time: {" "} {restaurantInfo.deliveryTime}mins</p>
              <p>Sales Tax: {" "} £{restaurantInfo.deliveryTax}</p>
              
            </div>
          </div>
          {/* Restaurant Contact Details */}
          <div>
            <h2 className="text-lg md:text-xl font-bold mb-2">Contact</h2>
            <p className="text-gray-500 text-xs md:text-[16px] font-normal leading-[16px] md:leading-[24px]">
              If you have allergies or other dietary restrictions, please
              contact the restaurant. The restaurant will provide food-specific
              information upon request.
            </p>
            {/* Phone */}
            <div className=" flex justify-between text-xs md:text-[16px] font-normal leading-[16px] md:leading-[24px] mt-2">
              <h1 className="text-sm md:text-[16px] font-bold mb-2">
                Phone Number
              </h1>
              {restaurantInfo?.phone !== "N/A" ?
                <a
                  href={`tel:${restaurantInfo?.phone}`}
                  className="text-blue-500 hover:underline"
                >
                  {restaurantInfo?.phone}
                </a>
              : <span className="text-gray-500">N/A</span>}
            </div>
            <hr />
            <div className=" flex justify-between text-xs md:text-[16px] font-normal mt-2">
              <h1 className="text-sm md:text-[16px] font-bold mb-2">Email</h1>
              {restaurantInfo?.username !== "N/A" ?
                <a
                  href={`mailto:${restaurantInfo?.username || "N/A"}`}
                  className="text-blue-500 hover:underline"
                >
                  {restaurantInfo?.username}
                </a>
              : <span className="text-gray-500">N/A</span>}
            </div>
          </div>
        </div>
      </div>
    </CustomDialog>
  );
};

export default InfoModal;
