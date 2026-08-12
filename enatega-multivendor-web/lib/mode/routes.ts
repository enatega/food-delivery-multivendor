import { APP_MODES, type AppMode } from "./constants";

const MULTI_ONLY = [/^\/restaurants/, /^\/store/, /^\/mapview/, /^\/restaurantInfo/];
const SINGLE_ONLY = [/^\/deals/, /^\/browse/, /^\/category\//, /^\/product\//, /^\/profile\/(favorites|vouchers|wallet|membership|referral)/];

export const isRouteCompatible = (pathname: string, mode: AppMode) => {
  const rules = mode === APP_MODES.SINGLE ? MULTI_ONLY : SINGLE_ONLY;
  return !rules.some((rule) => rule.test(pathname));
};

export const routeAfterModeSwitch = (pathname: string, mode: AppMode) =>
  isRouteCompatible(pathname, mode) ? pathname : "/discovery";
