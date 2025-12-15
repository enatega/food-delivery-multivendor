export interface OpeningSlot {
  startTime: [string, string]; // ["09", "00"]
  endTime: [string, string];   // ["18", "00"]
}

export interface OpeningTime {
  day: string;                // "MON"
  times: OpeningSlot[];
}

export interface Restaurant {
  _id: string;
  name: string;
  image: string;
  address: string;
  reviewAverage: number;
  reviewCount: number;
  shopType: string;
  slug: string;

  isAvailable?: boolean;
  isActive?: boolean;

  location: {
    coordinates: [number, number]; // [lng, lat]
  };

  openingTimes: OpeningTime[];
}


export function isRestaurantOpen(restaurant: Restaurant): boolean {
  if (!restaurant?.isAvailable || !restaurant?.isActive) return false;

  const openingTimes = restaurant.openingTimes || [];
  if (!openingTimes.length) return false;

  const now = new Date();
  const currentDay = now.toLocaleString("en-US", { weekday: "short" }).toUpperCase();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const todayOpening = openingTimes.find((ot) => ot.day === currentDay);
  if (!todayOpening) return false;

  return todayOpening.times.some(({ startTime, endTime }) => {
    const [startHour, startMinute] = startTime.map(Number);
    const [endHour, endMinute] = endTime.map(Number);

    const startTotal = startHour * 60 + startMinute;
    const endTotal = endHour * 60 + endMinute;
    const nowTotal = currentHour * 60 + currentMinute;

    return nowTotal >= startTotal && nowTotal <= endTotal;
  });
}
