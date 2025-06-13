// Converts numeric degrees to radians
function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

// Calculates the distance between two coordinates in kilometers
export function calculateDistance(
  latS: number,
  lonS: number,
  latD: number,
  lonD: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(latD - latS);
  const dLon = toRad(lonD - lonS);
  const lat1 = toRad(latS);
  const lat2 = toRad(latD);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

// Calculates the delivery amount based on cost type and distance
export function calculateAmount(
  costType: "fixed" | "per_km",
  deliveryRate: number,
  distance: number
): number {
  return costType === "fixed" ? deliveryRate : (
      Math.ceil(distance) * deliveryRate
    );
}
