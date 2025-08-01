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

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.getDetails({ placeId }, (place, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        place?.geometry?.location
      ) {
        const latitude = place.geometry.location.lat();
        const longitude = place.geometry.location.lng();

        onUseLocalStorage(
          "save",
          USER_CURRENT_LOCATION_LS_KEY,
          JSON.stringify({
            label: "Home",
            location: {
              coordinates: [longitude, latitude],
            },
            _id: "",

            deliveryAddress: description,
          })
        );

        setUserAddress({
          _id: "",
          label: description,
          location: {
            coordinates: [longitude, latitude],
          },
          deliveryAddress: description,
          details: `Selected from Google search`,
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
    }
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
    <div
      ref={containerRef}
      className="w-full max-w-md mx-auto p-2 rounded-md relative"
    >
      <div className="flex justify-center items-center gap-4 rounded-full bg-white p-4 border-2 border-transparent hover:border-[#7dd24f] ">
        <i
          className="pi pi-map-marker"
          style={{ fontSize: "1.5rem", color: "black" }}
        ></i>
        <input
          ref={inputRef}
          type="text"
          placeholder={t('searchCity')}
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          className="w-full border rounded-md focus:outline-none focus:ring-0 hover:outline-none hover:ring-0 border-none"
        />
      </div>
      {suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 z-10 bg-white border rounded-md shadow-md">
          {suggestions.map((suggestion) => (
            <div
              className="flex gap-2 p-2 items-center"
              key={suggestion.place_id}
            >
              <i
                className="pi pi-map-marker"
                style={{
                  fontSize: "1.3rem",
                  color: "black",
                  backgroundColor: "#ededee",
                  padding: "6px",
                  borderRadius: "50%",
                }}
              ></i>
              <div className="w-full flex ">
                <li
                  onClick={() =>
                    handleSelect(suggestion.place_id, suggestion.description)
                  }
                  className=" hover:text-[#94e469] px-5 hover:cursor-pointer"
                >
                  {suggestion.description}
                </li>
                <hr />
              </div>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CitySearch;
