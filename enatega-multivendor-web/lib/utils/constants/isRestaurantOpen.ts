type TimeValue = string[] | string | null | undefined;

export interface OpeningSlot {
  startTime?: TimeValue;
  endTime?: TimeValue;
}

export interface OpeningTime {
  day?: string | null;
  times?: OpeningSlot[] | null;
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
  isAvailable?: boolean | null;
  isActive?: boolean | null;
  location: {
    coordinates: [number, number];
  };
  openingTimes?: OpeningTime[] | null;
}

type OpenStateInput =
  | Restaurant
  | {
      isAvailable?: boolean | null;
      isActive?: boolean | null;
      openingTimes?: OpeningTime[] | null;
    }
  | OpeningTime[]
  | null
  | undefined;

const toMinutes = (time: TimeValue): number | null => {
  if (Array.isArray(time)) {
    if (time.length < 2) return null;

    const hours = Number(time[0]);
    const minutes = Number(time[1]);

    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;

    return hours * 60 + minutes;
  }

  if (typeof time === "string") {
    const [hours, minutes] = time.split(":");
    if (hours == null || minutes == null) return null;

    const parsedHours = Number(hours);
    const parsedMinutes = Number(minutes);

    if (!Number.isFinite(parsedHours) || !Number.isFinite(parsedMinutes)) {
      return null;
    }

    return parsedHours * 60 + parsedMinutes;
  }

  return null;
};

const getOpeningTimes = (input: OpenStateInput): OpeningTime[] => {
  if (Array.isArray(input)) return input;
  return input?.openingTimes ?? [];
};

export function isRestaurantOpen(input: OpenStateInput): boolean {
  if (!input) return false;

  if (!Array.isArray(input)) {
    if (input.isAvailable === false || input.isActive === false) {
      return false;
    }
  }

  const openingTimes = getOpeningTimes(input);
  if (!openingTimes.length) return false;

  const now = new Date();
  const currentDay = now
    .toLocaleString("en-US", { weekday: "short" })
    .toUpperCase();
  const nowTotal = now.getHours() * 60 + now.getMinutes();

  const todayOpening = openingTimes.find(
    (openingTime) => openingTime.day === currentDay,
  );

  if (!todayOpening?.times?.length) return false;

  return todayOpening.times.some(({ startTime, endTime }) => {
    const startTotal = toMinutes(startTime);
    const endTotal = toMinutes(endTime);

    if (startTotal === null || endTotal === null) return false;

    return nowTotal >= startTotal && nowTotal <= endTotal;
  });
}
