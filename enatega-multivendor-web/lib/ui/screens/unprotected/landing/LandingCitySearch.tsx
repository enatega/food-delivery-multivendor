"use client";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiMapPin, FiNavigation } from "react-icons/fi";

import { GoogleMapsContext } from "@/lib/context/global/google-maps.context";
import { useUserAddress } from "@/lib/context/address/address.context";
import useDebounce from "@/lib/hooks/useDebounce";
import useLocation from "@/lib/hooks/useLocation";
import { USER_CURRENT_LOCATION_LS_KEY } from "@/lib/utils/constants";
import { onUseLocalStorage } from "@/lib/utils/methods/local-storage";

type SelectedCity = {
  description: string;
  latitude: number;
  longitude: number;
};

export default function LandingCitySearch() {
  const t = useTranslations();
  const landingT = useTranslations("Landing");
  const router = useRouter();
  const { isLoaded } = useContext(GoogleMapsContext);
  const { setUserAddress } = useUserAddress();
  const { getCurrentLocation } = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selectedCity, setSelectedCity] = useState<SelectedCity | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  const [status, setStatus] = useState("");
  const debouncedQuery = useDebounce(query, 350);

  const persistAndDiscover = useCallback(
    (city: SelectedCity) => {
      const coordinates: [number, number] = [city.longitude, city.latitude];
      const address = {
        _id: "",
        label: t("Address"),
        location: { coordinates },
        deliveryAddress: city.description,
        details: city.description,
      };

      onUseLocalStorage(
        "save",
        USER_CURRENT_LOCATION_LS_KEY,
        JSON.stringify(address),
      );
      setUserAddress(address);
      router.push("/discovery");
    },
    [router, setUserAddress, t],
  );

  useEffect(() => {
    if (!isLoaded || !window.google || debouncedQuery.trim().length < 2) {
      setSuggestions([]);
      setActiveIndex(-1);
      return;
    }

    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      { input: debouncedQuery, types: ["(cities)"] },
      (predictions, resultStatus) => {
        if (
          resultStatus === window.google.maps.places.PlacesServiceStatus.OK &&
          predictions
        ) {
          setSuggestions(predictions);
          setActiveIndex(-1);
        } else {
          setSuggestions([]);
        }
      },
    );
  }, [debouncedQuery, isLoaded]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setSuggestions([]);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const selectSuggestion = (
    suggestion: google.maps.places.AutocompletePrediction,
  ) => {
    if (!window.google) return;
    setIsResolving(true);
    setStatus(landingT("search.resolving"));
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ placeId: suggestion.place_id }, (results, resultStatus) => {
      const location = results?.[0]?.geometry?.location;
      if (resultStatus === "OK" && location) {
        const city = {
          description: suggestion.description,
          latitude: location.lat(),
          longitude: location.lng(),
        };
        setQuery(suggestion.description);
        setSelectedCity(city);
        setSuggestions([]);
        setActiveIndex(-1);
        setStatus(landingT("search.ready"));
      } else {
        setStatus(landingT("search.cityError"));
      }
      setIsResolving(false);
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) =>
        index <= 0 ? suggestions.length - 1 : index - 1,
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      const suggestion = suggestions[activeIndex >= 0 ? activeIndex : 0];
      if (suggestion) selectSuggestion(suggestion);
    } else if (event.key === "Escape") {
      setSuggestions([]);
      setActiveIndex(-1);
    }
  };

  const useCurrentLocation = () => {
    setIsResolving(true);
    setStatus(landingT("search.locating"));
    getCurrentLocation((error, location) => {
      if (error || !location) {
        setStatus(landingT("search.locationError"));
        setIsResolving(false);
        return;
      }
      persistAndDiscover({
        description: location.deliveryAddress,
        latitude: location.latitude,
        longitude: location.longitude,
      });
    });
  };

  return (
    <div ref={rootRef} className="relative z-30 w-full">
      <div className="quiet-search flex min-h-16 flex-col rounded-[14px] bg-dispatch-surface shadow-dispatch-float ring-1 ring-dispatch-line sm:flex-row sm:items-center">
        <div className="flex min-h-16 min-w-0 flex-1 items-center gap-3 px-4 sm:px-5">
          <FiMapPin aria-hidden className="h-5 w-5 shrink-0 text-dispatch-ink" />
          <label htmlFor="landing-city-search" className="sr-only">
            {t("searchCity")}
          </label>
          <input
            id="landing-city-search"
            type="text"
            value={query}
            placeholder={t("searchCity")}
            role="combobox"
            autoComplete="off"
            aria-autocomplete="list"
            aria-controls="landing-city-suggestions"
            aria-expanded={suggestions.length > 0}
            aria-activedescendant={
              activeIndex >= 0 ? `landing-city-option-${activeIndex}` : undefined
            }
            onKeyDown={handleKeyDown}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedCity(null);
              setStatus("");
            }}
            className="min-w-0 flex-1 bg-transparent py-3 text-[15px] text-dispatch-ink outline-none placeholder:text-dispatch-muted"
          />
        </div>

        <div className="flex items-center gap-1 border-t border-dispatch-line p-1.5 sm:border-l sm:border-t-0 rtl:sm:border-l-0 rtl:sm:border-r">
          <button
            type="button"
            onClick={useCurrentLocation}
            disabled={isResolving}
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 whitespace-nowrap px-3 text-xs font-semibold text-primary-dark transition-colors hover:text-dispatch-ink focus-visible:outline-none disabled:cursor-wait disabled:opacity-55 sm:flex-none sm:px-4 sm:text-sm"
          >
            <FiNavigation aria-hidden />
            {t("current_location_btn")}
          </button>
          <button
            type="button"
            disabled={!selectedCity || isResolving}
            onClick={() => selectedCity && persistAndDiscover(selectedCity)}
            className="group inline-flex min-h-12 flex-1 items-center justify-center gap-3 rounded-xl bg-primary-color px-4 text-sm font-semibold text-[#151914] transition-colors hover:bg-primary-hover focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-primary-color disabled:text-[#151914] disabled:opacity-70 sm:flex-none sm:px-5"
          >
            {t("show_items_btn")}
            <FiArrowRight
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180"
            />
          </button>
        </div>
      </div>

      {suggestions.length > 0 && (
        <ul
          id="landing-city-suggestions"
          role="listbox"
          className="absolute inset-x-0 top-[calc(100%+10px)] max-h-72 overflow-y-auto rounded-[14px] bg-dispatch-surface p-2 shadow-dispatch-overlay ring-1 ring-dispatch-line"
        >
          {suggestions.map((suggestion, index) => (
            <li
              id={`landing-city-option-${index}`}
              key={suggestion.place_id}
              role="option"
              aria-selected={index === activeIndex}
            >
              <button
                type="button"
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectSuggestion(suggestion)}
                className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left text-sm transition-colors rtl:text-right ${
                  index === activeIndex
                    ? "bg-primary-light text-dispatch-ink dark:bg-dispatch-map"
                    : "text-dispatch-muted hover:bg-dispatch-map"
                }`}
              >
                <FiMapPin aria-hidden className="shrink-0 text-primary-dark" />
                <span>{suggestion.description}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="sr-only" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
