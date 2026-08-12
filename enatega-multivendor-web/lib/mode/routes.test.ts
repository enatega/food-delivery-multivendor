import { describe, expect, it } from "vitest";
import { APP_MODES } from "./constants";
import { isRouteCompatible, routeAfterModeSwitch } from "./routes";

describe("mode route compatibility", () => {
  it("keeps shared routes", () => expect(routeAfterModeSwitch("/profile", APP_MODES.SINGLE)).toBe("/profile"));
  it("redirects multi-only routes in single mode", () => expect(routeAfterModeSwitch("/restaurants", APP_MODES.SINGLE)).toBe("/discovery"));
  it("marks single product routes as incompatible in multi mode", () => expect(isRouteCompatible("/product/food-1", APP_MODES.MULTI)).toBe(false));
});
