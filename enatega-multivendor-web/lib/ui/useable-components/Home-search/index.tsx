import React, { useRef, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";

// Context
import { GoogleMapsContext } from "@/lib/context/global/google-maps.context";

// Hook
import useDebounce from "@/lib/hooks/useDebounce";
import { useUserAddress } from "@/lib/context/address/address.context";
import { USER_CURRENT_LOCATION_LS_KEY } from "@/lib/utils/constants";
import { onUseLocalStorage } from "@/lib/utils/methods/local-storage";
import { useTranslations } from "next-intl";
import { FiMapPin } from "react-icons/fi";

const CitySearch: React.FC = () => {
  // Ref
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null); // Added containerRef

  // Hook
  const router = useRouter();
  const { setUserAddress } = useUserAddress();

  // Context
  const { isLoaded } = useContext(GoogleMapsContext);

  // States
  const [cityName, setCityName] = useState<string>("");
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const debouncedCityName = useDebounce(cityName, 500);

  // Handlers
  const handleSelect = (placeId: string, description: string) => {
    if (!window.google || !isLoaded) return;

    const geocoder = new window.google.maps.Geocoder();

    // Resolve the place to coordinates with the Geocoder instead of Places
    // getDetails. Geocoding by placeId only returns geometry/address and is
    // billed under the cheaper Geocoding SKU — it never triggers Places
    // Contact or Atmosphere Data charges. We only need the lat/lng here.
    geocoder.geocode({ placeId }, (results, status) => {
      if (
        status === window.google.maps.GeocoderStatus.OK &&
        results?.[0]?.geometry?.location
      ) {
        const latitude = results[0].geometry.location.lat();
        const longitude = results[0].geometry.location.lng();
        console.log("longitude and latitude", longitude, latitude);
        console.log("description:", description);
        onUseLocalStorage(
          "save",
          USER_CURRENT_LOCATION_LS_KEY,
          JSON.stringify({
            label: t("Address"),
            location: {
              coordinates: [longitude, latitude],
            },
            _id: "",

            deliveryAddress: description,
          }),
        );

        setUserAddress({
          _id: "",
          label: t("Address"),
          location: {
            coordinates: [longitude, latitude],
          },
          deliveryAddress: description,
          details: description,
        });

        router.push("/discovery");
        setCityName("");
        setSuggestions([]);
      }
    });
  };

  const t = useTranslations();

  // USe Effects
  useEffect(() => {
    if (!isLoaded || !window.google || debouncedCityName.length < 2) {
      setSuggestions([]);
      return;
    }

    const autocompleteService =
      new window.google.maps.places.AutocompleteService();

    autocompleteService.getPlacePredictions(
      { input: debouncedCityName, types: ["(cities)"] },
      (predictions, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          predictions
        ) {
          setSuggestions(predictions);
        } else {
          setSuggestions([]);
        }
      },
    );
  }, [debouncedCityName, isLoaded]);

  // Added effect for outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex min-h-14 items-center gap-3 rounded-xl border border-dispatch-line bg-dispatch-surface px-4 transition-colors focus-within:border-primary-color focus-within:ring-2 focus-within:ring-primary-focus">
        <FiMapPin aria-hidden className="h-5 w-5 shrink-0 text-dispatch-ink" />
        <input
          ref={inputRef}
          type="text"
          placeholder={t("searchCity")}
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          className="min-w-0 flex-1 border-0 bg-transparent py-3 text-sm text-dispatch-ink outline-none placeholder:text-dispatch-muted focus:ring-0"
        />
      </div>
      {suggestions.length > 0 && (
        <ul className="absolute inset-x-0 top-[calc(100%+8px)] z-30 max-h-72 overflow-y-auto rounded-xl border border-dispatch-line bg-dispatch-surface p-2 shadow-dispatch-overlay">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              className="border-b border-dispatch-line last:border-b-0"
            >
              <button
                type="button"
                onClick={() =>
                  handleSelect(suggestion.place_id, suggestion.description)
                }
                className="flex min-h-12 w-full items-center gap-3 px-3 py-2 text-left text-sm text-dispatch-ink transition-colors hover:bg-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color"
              >
                <FiMapPin
                  aria-hidden
                  className="h-4 w-4 shrink-0 text-primary-dark"
                />
                <span>{suggestion.description}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CitySearch;
