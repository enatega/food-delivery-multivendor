import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import LandingCitySearch from "./LandingCitySearch";

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  save: vi.fn(),
  setUserAddress: vi.fn(),
  getCurrentLocation: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.push }),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) =>
    ({
      searchCity: "Search for a city...",
      current_location_btn: "Current Location",
      show_items_btn: "Show Items",
      Address: "Address",
    })[key] ?? key,
}));

vi.mock("@/lib/context/global/google-maps.context", async () => {
  const React = await import("react");
  return { GoogleMapsContext: React.createContext({ isLoaded: true }) };
});

vi.mock("@/lib/context/address/address.context", () => ({
  useUserAddress: () => ({ setUserAddress: mocks.setUserAddress }),
}));

vi.mock("@/lib/hooks/useDebounce", () => ({ default: (value: string) => value }));
vi.mock("@/lib/hooks/useLocation", () => ({
  default: () => ({ getCurrentLocation: mocks.getCurrentLocation }),
}));
vi.mock("@/lib/utils/methods/local-storage", () => ({
  onUseLocalStorage: mocks.save,
}));

const prediction = {
  description: "Lahore, Pakistan",
  place_id: "lahore",
};

describe("LandingCitySearch", () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    window.google = {
      maps: {
        places: {
          PlacesServiceStatus: { OK: "OK" },
          AutocompleteService: class {
            getPlacePredictions(_request, callback) {
              callback([prediction], "OK");
            }
          },
        },
        Geocoder: class {
          geocode(_request, callback) {
            callback(
              [{ geometry: { location: { lat: () => 31.52, lng: () => 74.35 } } }],
              "OK",
            );
          }
        },
      },
    } as typeof window.google;
  });

  it("supports keyboard selection, clearing, persistence, and discovery routing", async () => {
    render(<LandingCitySearch />);
    const input = screen.getByRole("combobox", { name: "Search for a city..." });
    const submit = screen.getByRole("button", { name: /Show Items/ });

    expect(submit).toBeDisabled();
    fireEvent.change(input, { target: { value: "La" } });
    const option = await screen.findByRole("option", { name: "Lahore, Pakistan" });
    expect(option).toBeVisible();

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input).toHaveAttribute("aria-activedescendant", "landing-city-option-0");
    fireEvent.keyDown(input, { key: "Enter" });
    await waitFor(() => expect(submit).toBeEnabled());

    fireEvent.change(input, { target: { value: "Lahore" } });
    expect(submit).toBeDisabled();
    fireEvent.change(input, { target: { value: "La" } });
    await screen.findByRole("option", { name: "Lahore, Pakistan" });
    fireEvent.keyDown(input, { key: "Enter" });
    await waitFor(() => expect(submit).toBeEnabled());
    fireEvent.click(submit);

    expect(mocks.save).toHaveBeenCalledWith(
      "save",
      expect.any(String),
      expect.stringContaining("Lahore, Pakistan"),
    );
    expect(mocks.setUserAddress).toHaveBeenCalled();
    expect(mocks.push).toHaveBeenCalledWith("/discovery");
  });

  it("persists current location and routes directly to discovery", async () => {
    mocks.getCurrentLocation.mockImplementation((callback) =>
      callback(null, {
        deliveryAddress: "Islamabad, Pakistan",
        latitude: 33.68,
        longitude: 73.04,
      }),
    );
    render(<LandingCitySearch />);
    fireEvent.click(screen.getByRole("button", { name: "Current Location" }));

    await waitFor(() => expect(mocks.push).toHaveBeenCalledWith("/discovery"));
    expect(mocks.save).toHaveBeenCalledWith(
      "save",
      expect.any(String),
      expect.stringContaining("Islamabad, Pakistan"),
    );
  });
});
