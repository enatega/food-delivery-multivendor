import {
  faCheck,
  faCreditCard,
  faDollar,
  faExclamationTriangle,
  faInfoCircle,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { ISeverityStyles } from "../interfaces/toast.interface";


export const ENV: "DEV" | "STAGE" | "PROD" = "STAGE";

// Prices
export const APP_NAME = "Enatega";
export const LOGO_URL = "/";

export const MIN_PRICE = 0.0;
export const MAX_PRICE = 99999;

// File Sizes
export const MAX_LANSDCAPE_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
export const MAX_SQUARE_FILE_SIZE = 500 * 1000; // 500 KB
export const MAX_VIDEO_FILE_SIZE = 8 * 1024 * 1024; // 8 MB

// Default Locale
export const DEFAULT_LOCALE: string = "en";

// Severity Styles
export const SEVERITY_STYLES: ISeverityStyles = {
  error: {
    bgColor: "#FFC5C5",
    textColor: "#FF0000",
    icon: faXmarkCircle,
    iconBg: "#FFC5C5",
  },
  success: {
    bgColor: "#C6F7D0",
    textColor: "#34C759",
    icon: faCheck,
    iconBg: "#C6F7D0",
  },
  info: {
    bgColor: "#B2E2FC",
    textColor: "#2196F3",
    icon: faInfoCircle,
    iconBg: "#B2E2FC",
  },
  warn: {
    bgColor: "#F7DC6F",
    textColor: "#F7DC6F",
    icon: faExclamationTriangle,
    iconBg: "#F7DC6F",
  },
};

export const TIPS = ["2", "4", "6", "8"];

export const PAYMENT_METHOD_LIST = [
  {
    label: "cash",
    value: "COD",
    icon: faDollar,
  },
  {
    label: "card",
    value: "STRIPE",
    icon: faCreditCard,
  },
];

export const USER_CURRENT_LOCATION_LS_KEY = "user-current-location";


export const languageTypes = [
  { value: 'English', code: 'en', index: 0 },
  { value: 'العربية', code: 'ar', index: 1 },
  { value: 'français', code: 'fr', index: 2 },
  { value: 'ភាសាខ្មែរ', code: 'km', index: 3 },
  { value: '中文', code: 'zh', index: 4 },
  { value: 'Deutsche', code: 'de', index: 5 },
  { value: 'עִברִית', code: 'he', index: 6 },
  { value: 'हिंदी', code: 'hi', index: 7 },
  { value: 'español', code: 'es', index: 8 },
  { value: 'বাংলা', code: 'bn', index: 9 },
  { value: 'português', code: 'pt', index: 10 },
  { value: 'русский', code: 'ru', index: 11 },
  { value: 'اردو', code: 'ur', index: 12 },
  { value: 'Bahasa Indonesia', code: 'id', index: 13 },
  { value: '日本語', code: 'jp', index: 14 },
  { value: 'Türkçe', code: 'tr', index: 15 },
  { value: 'मराठी', code: 'mr', index: 16 },
  { value: 'తెలుగు', code: 'te', index: 17 },
  { value: 'Tiếng Việt', code: 'vi', index: 18 },
  { value: '한국어', code: 'ko', index: 19 },
  { value: 'italiano', code: 'it', index: 20 },
  { value: 'ไทย', code: 'th', index: 21 },
  { value: 'ગુજરાતી', code: 'gu', index: 22 },
  { value: 'فارسی', code: 'fa', index: 23 },
  { value: 'polski', code: 'pl', index: 24 },
  { value: 'پښتو', code: 'ps', index: 25 },
  { value: 'română', code: 'ro', index: 26 },
  { value: 'کوردی', code: 'ku', index: 27 },
  { value: 'ozbek', code: 'uz', index: 28 },
  { value: 'azərbaycan', code: 'az', index: 29 },
  { value: 'Nederlands', code: 'nl', index: 30 }
]