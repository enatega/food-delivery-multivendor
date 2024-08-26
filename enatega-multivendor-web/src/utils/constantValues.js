const APP_NAME = "enatega";
const FACEBOOK_HANDLE = "enatega";
const TWITTER_HANDLE = "NinjasCode1";
const INSTAGRAM_HANDLE = "enatega.nb";
const LINKEDIN_URL = "https://www.linkedin.com/company/14583783";
const IOS_STORE_URL =
  "https://apps.apple.com/pk/app/enatega-multivendor/id1526488093";
const ANDROID_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.enatega.multivendor";
const MEDIUM_HANDLE = "enatega";
const WEBSITE_URL = "https://enatega.com/#contact";

const RIDER_APP_ANDROID_URL =
  "https://play.google.com/store/apps/details?id=com.enatega.multirider";
const RIDER_APP_IOS_URL =
  "https://apps.apple.com/pk/app/enatega-mulitvendor-rider/id1526674511";

const RESTAURANT_APP_ANDROID_URL =
  "https://play.google.com/store/apps/details?id=multivendor.enatega.restaurant";
const RESTAURANT_APP_IOS_URL =
  "https://apps.apple.com/pk/app/enatega-multivendor-restaurant/id1526672537";

const CUSTOMER_APP_ANDROID_URL =
  "https://play.google.com/store/apps/details?id=com.enatega.multivendor";
const CUSTOMER_APP_IOS_URL =
  "https://apps.apple.com/pk/app/enatega-multivendor/id1526488093";

const ADMIN_DASHBOARD_URL = "https://multivendor-admin.enatega.com/"
const PRODUCT_PAGE_URL = "https://enatega.com/"

const DEFAULT_USER_EMAIL = "demo-customer@enatega.com"

const INFO_EMAIL=" info@enatega.com" //space is part of it.


const BACKEND_URLS = {
  LOCAL: {
    SERVER_URL: "http://10.97.37.216:8001/",
    WS_SERVER_URL: "ws://10.97.37.216:8001/",
  },
  LIVE: {
    SERVER_URL: "https://enatega-multivendor.up.railway.app/",
    WS_SERVER_URL: "wss://enatega-multivendor.up.railway.app/",
  },
};

const ACTIVE_STATUS = ["PENDING", "PICKED", "ACCEPTED", "ASSIGNED"];
const INACTIVE_STATUS = ["DELIVERED", "COMPLETED", "CANCELLED"];
const ORDER_STATUS = ["PENDING", "ACCEPTED"];
const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export {
  ACTIVE_STATUS,
  INACTIVE_STATUS,
  ORDER_STATUS,
  DAYS,
  APP_NAME,
  FACEBOOK_HANDLE,
  TWITTER_HANDLE,
  INSTAGRAM_HANDLE,
  LINKEDIN_URL,
  IOS_STORE_URL,
  ANDROID_STORE_URL,
  MEDIUM_HANDLE,
  WEBSITE_URL,
  BACKEND_URLS,
  RIDER_APP_ANDROID_URL,
  RIDER_APP_IOS_URL,
  RESTAURANT_APP_ANDROID_URL,
  RESTAURANT_APP_IOS_URL,
  CUSTOMER_APP_ANDROID_URL,
  CUSTOMER_APP_IOS_URL,
  ADMIN_DASHBOARD_URL,
  PRODUCT_PAGE_URL,
  DEFAULT_USER_EMAIL,
  INFO_EMAIL
};
