import { APP_MODES, type AppMode } from "./constants";

const MULTI_ONLY = [
  /^\/restaurants/,
  /^\/store/,
  /^\/mapview/,
  /^\/restaurantInfo/,
];
const SINGLE_ONLY = [
  /^\/deals/,
  /^\/browse/,
  /^\/product\//,
  /^\/profile\/(favorites|vouchers|wallet|membership|referral)/,
];

export const isRouteCompatible = (pathname: string, mode: AppMode) => {
  const rules = mode === APP_MODES.SINGLE ? MULTI_ONLY : SINGLE_ONLY;
  return !rules.some((rule) => rule.test(pathname));
};

export const getModeHomeRoute = (mode: AppMode): "/" | "/discovery" =>
  mode === APP_MODES.SINGLE ? "/discovery" : "/";

export const routeAfterModeSwitch = (nextMode: AppMode) =>
  getModeHomeRoute(nextMode);
