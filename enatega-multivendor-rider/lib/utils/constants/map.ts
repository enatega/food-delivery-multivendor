import { AppTheme } from "../interfaces/app-theme";

export const CustomMapStyles = (appTheme: AppTheme) => {
  return [
    {
      elementType: "geometry",
      stylers: [
        {
          color: appTheme.mapBackground,
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [
        {
          color: appTheme.primary,
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        {
          color: appTheme.mapRoad,
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: appTheme.mapLabel,
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [
        {
          color: appTheme.mapRoad,
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: appTheme.mapBackground,
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          color: appTheme.mapWater,
        },
      ],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: appTheme.mapLabel,
        },
      ],
    },
  ];
};
