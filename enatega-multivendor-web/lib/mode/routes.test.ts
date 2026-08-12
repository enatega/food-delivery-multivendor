import { describe, expect, it } from "vitest";
import { APP_MODES } from "./constants";
import { isRouteCompatible, routeAfterModeSwitch } from "./routes";

describe("mode route compatibility", () => {
  it("returns to the root after every mode switch", () =>
    expect(routeAfterModeSwitch()).toBe("/"));
  it("marks single product routes as incompatible in multi mode", () =>
    expect(isRouteCompatible("/product/food-1", APP_MODES.MULTI)).toBe(false));
});
