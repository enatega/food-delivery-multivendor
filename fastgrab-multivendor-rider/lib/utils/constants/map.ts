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
          color: appTheme.lowOpacityPrimaryColor,
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: appTheme.black,
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [
        {
          color: appTheme.lowOpacityPrimaryColor,
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: appTheme.fontMainColor,
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          color: "#6ab8f7",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#515c6d",
        },
      ],
    },
  ];
};