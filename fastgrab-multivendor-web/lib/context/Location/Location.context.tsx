import { GET_ZONES } from "@/lib/api/graphql";
import useNetworkStatus from "@/lib/hooks/useNetworkStatus";
import {
  IArea,
  ILocation,
  ILocationContext,
  ILocationProvider,
  IMapZone,
} from "@/lib/utils/interfaces";
import { useQuery } from "@apollo/client";
import React, { useContext, useEffect, useRef, useState } from "react";

export const LocationContext = React.createContext({} as ILocationContext);

export const LocationProvider = ({ children }: ILocationProvider) => {
  // State
  const [location, setLocation] = useState<ILocation | null>(null);

  const [cities, setCities] = useState<IArea[] | []>([]);

  // Ref
  const isInitialRender = useRef(true);

  // Hooks
  const isOnline = useNetworkStatus();

  // API
  const { loading, error, data, refetch } = useQuery(GET_ZONES);

  // Effects

  useEffect(() => {
    if (!loading && !error && data) {
      const fetchedZones = data.zones || [];

      // Function to calculate centroid of a polygon
      const calculateCentroid = (coordinates: number[][][]) => {
        let x = 0,
          y = 0,
          area = 0;

        const points = coordinates[0]; // Assuming the first array contains the coordinates

        for (let i = 0; i < points?.length - 1; i++) {
          const x0 = points[i][0];
          const y0 = points[i][1];
          const x1 = points[i + 1][0];
          const y1 = points[i + 1][1];
          const a = x0 * y1 - x1 * y0;
          area += a;
          x += (x0 + x1) * a;
          y += (y0 + y1) * a;
        }

        area /= 2;
        x = x / (6 * area);
        y = y / (6 * area);

        return { latitude: y, longitude: x };
      };

      // Calculate centroids for each zone
      const centroids = fetchedZones.map((zone: IMapZone) => {
        const centroid = calculateCentroid(zone.location.coordinates);
        return {
          id: zone._id,
          name: zone.title,
          ...centroid,
          location: zone.location,
        };
      });

      // Set this as the cities or the midpoint
      setCities(centroids);
    }
  }, [loading, error, data]);

  useEffect(() => {
    if (isOnline) {
      refetch(); // Refetch the data when the internet is back
    }
  }, [isOnline, refetch]);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    if (location) localStorage.setItem("location", JSON.stringify(location));
  }, [location]);

  useEffect(() => {
    const locationStr = localStorage.getItem("location");

    if (locationStr && locationStr !== "undefined") {
      setLocation(JSON.parse(locationStr));
    }
  }, []);

  return (
    <LocationContext.Provider value={{ location, setLocation, cities }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => useContext(LocationContext);
