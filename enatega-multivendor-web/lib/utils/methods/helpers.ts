import {
  PAYPAL_ALLOWED_CURRENCIES,
  STRIPE_ALLOWED_CURRENCIES,
} from "../constants/currencies";
import { OrderStatus } from "../interfaces";
import emailjs from "emailjs-com";
import { onUseLocalStorage } from "./local-storage";

export function formatDate(dateString?: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatDateAndTime(dateString: string): string {
  const date = new Date(dateString);
  return `${date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}, ${date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}`;
}

export function formatTime(dateString?: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
}

export function getStatusLabel(status: OrderStatus): string {
  switch (status) {
    case "PENDING":
      return "Pending";
    case "ACCEPTED":
      return "Accepted";
    case "ASSIGNED":
      return "Assigned to Rider";
    case "PICKED":
      return "On the Way";
    case "DELIVERED":
      return "Delivered";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status;
  }
}

export function getStatusColor(
  status: OrderStatus
): "success" | "info" | "warning" | "danger" | undefined {
  switch (status) {
    case "PENDING":
      return "warning";
    case "ACCEPTED":
      return "info";
    case "ASSIGNED":
      return "info";
    case "PICKED":
      return "success";
    case "DELIVERED":
      return "success";
    case "COMPLETED":
      return "success";
    case "CANCELLED":
      return "danger";
    default:
      return undefined;
  }
}


export function loadGoogleMapsScript(key: string): Promise<void>{
  return new Promise((resolve, reject) => {
    if (typeof window.google === 'object' && window.google.maps) {
      resolve(); // already loaded
      return;
    }
    const scriptId = 'google-maps-script';
    if (document.getElementById(scriptId)) {
      resolve(); // already injected
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject('Google Maps script failed to load.');
    document.head.appendChild(script);
  });
}

// Format date from timestamp
export const formatDateForCreatedAt = (timestamp: string) => {
  try {
    const date = new Date(Number.parseInt(timestamp));
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());

    // Calculate minutes and hours
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Minutes (if less than an hour)
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes === 1) return "1 Minute ago";
    if (diffMinutes < 60) return `${diffMinutes} Minutes ago`;

    // Hours (if less than a day)
    if (diffHours === 1) return "1 Hour ago";
    if (diffHours < 24) return `${diffHours} Hours ago`;

    // Days (if less than a month)
    if (diffDays === 1) return "1 Day ago";
    if (diffDays < 30) return `${diffDays} Days ago`;

    // Months (if less than a year)
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return "1 Month ago";
    if (diffMonths < 12) return `${diffMonths} Months ago`;

    // Years
    const diffYears = Math.floor(diffDays / 365);
    if (diffYears === 1) return "1 Year ago";
    return `${diffYears} Years ago`;
  } catch (error) {
    return "Unknown date";
  }
};

export function checkPaymentMethod(currency: string, paymentMethod: string) {
  if (paymentMethod === "STRIPE") {
    return STRIPE_ALLOWED_CURRENCIES.find((val) => val.currency === currency);
  }
  if (paymentMethod === "PAYPAL") {
    return PAYPAL_ALLOWED_CURRENCIES.find((val) => val.currency === currency);
  }
  return true;
}
// Format time from [hours, minutes] to HH:MM format
export const formatTimeForHoursMins = (time: [string, string]) => {
  return `${time[0].padStart(2, "0")}:${time[1].padStart(2, "0")}`;
};

// Get the current day in a readable format
//Example "MON" => "Monday"
export const getCurrentDay = (day: string) => {
  switch (day) {
    case "MON":
      return "Monday";
    case "TUE":
      return "Tuesday";
    case "WED":
      return "Wednesday";
    case "THU":
      return "Thursday";
    case "FRI":
      return "Friday";
    case "SAT":
      return "Saturday";
    case "SUN":
      return "Sunday";
    default:
      return "";
  }
};

export const getDistanceFromLatLonInKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // distance in km
}



export const sendEmail = (templateId : any, templateParams : any) => {
  return emailjs.send(
    "service_463sz1v",
    templateId,
    templateParams,
    "kfOnsw1Kn8ZWu4l77"
  );
};

const LOCAL_STORAGE_KEY = "searchedKeywords";

export const saveSearchedKeyword = (keyword: string) => {
  if (!keyword) return;

  try {
    const stored = onUseLocalStorage("get", LOCAL_STORAGE_KEY);
    let keywords = stored ? JSON.parse(stored) : [];

    // Avoid duplicates
    if (!keywords.includes(keyword)) {
      keywords.push(keyword);
      onUseLocalStorage("save", LOCAL_STORAGE_KEY, JSON.stringify(keywords));
    }
  } catch (err) {
    console.error("Failed to save keyword:", err);
  }
};

export const getSearchedKeywords = (): string[] => {
  try {
    const stored = onUseLocalStorage("get", LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const deleteSearchedKeywords = () => {
  try {
    onUseLocalStorage("delete", LOCAL_STORAGE_KEY);
  } catch {
    // Do nothing or log if necessary
  }
};


export const toFloatIfNeeded = (value: string | number) => {
  if (typeof value === "number") return value;        // already float/number

  if (typeof value === "string") {
    const num = parseFloat(value);
    return isNaN(num) ? null : num;                   // convert if valid
  }
  return null;                                        // fallback
}