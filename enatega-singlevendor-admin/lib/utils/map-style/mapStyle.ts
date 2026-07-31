// lib/utils/mapStyles.ts

export const darkMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#1F2937" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
    {
      featureType: "landscape.natural",
      elementType: "geometry",
      stylers: [
        { color: "#165E3A" }, // Tailwind green-900 for darker natural areas
      ],
    },
  // Tailwind green-800 or #165E3A
    {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [{ color: "#757575" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#38BDF8" }],
    },
  ];
  