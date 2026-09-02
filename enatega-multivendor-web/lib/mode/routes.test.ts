import { describe, expect, it } from "vitest";
import { APP_MODES } from "./constants";
import {
  getModeHomeRoute,
  isRouteCompatible,
  routeAfterModeSwitch,
} from "./routes";

describe("mode route compatibility", () => {
  it("uses the marketplace root as the multivendor home", () =>
    expect(getModeHomeRoute(APP_MODES.MULTI)).toBe("/"));
  it("uses discovery as the single-vendor home", () =>
    expect(getModeHomeRoute(APP_MODES.SINGLE)).toBe("/discovery"));
  it("routes mode switches to the destination mode home", () => {
    expect(routeAfterModeSwitch(APP_MODES.MULTI)).toBe("/");
    expect(routeAfterModeSwitch(APP_MODES.SINGLE)).toBe("/discovery");
  });
  it("marks single product routes as incompatible in multi mode", () =>
    expect(isRouteCompatible("/product/food-1", APP_MODES.MULTI)).toBe(false));
  it("allows category routes in both app modes", () => {
    expect(isRouteCompatible("/category/thai-cuisine", APP_MODES.MULTI)).toBe(
      true,
    );
    expect(isRouteCompatible("/category/thai-cuisine", APP_MODES.SINGLE)).toBe(
      true,
    );
  });
});
