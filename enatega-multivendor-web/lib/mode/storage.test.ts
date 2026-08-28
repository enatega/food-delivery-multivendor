import { beforeEach, describe, expect, it } from "vitest";
import { APP_MODES, APP_MODE_STORAGE_KEY } from "./constants";
import { getModeStorageKey, migrateLegacyMultivendorStorage, modeStorage } from "./storage";

describe("mode storage", () => {
  beforeEach(() => localStorage.clear());
  it("isolates customer state", () => {
    modeStorage.set("token", "multi", APP_MODES.MULTI);
    modeStorage.set("token", "single", APP_MODES.SINGLE);
    expect(modeStorage.get("token", APP_MODES.MULTI)).toBe("multi");
    expect(modeStorage.get("token", APP_MODES.SINGLE)).toBe("single");
  });
  it("keeps global preferences shared", () => expect(getModeStorageKey(APP_MODE_STORAGE_KEY, APP_MODES.SINGLE)).toBe(APP_MODE_STORAGE_KEY));
  it("copies legacy state into multi without deleting it", () => {
    localStorage.setItem("cartItems", "[]");
    migrateLegacyMultivendorStorage();
    expect(modeStorage.get("cartItems", APP_MODES.MULTI)).toBe("[]");
    expect(localStorage.getItem("cartItems")).toBe("[]");
  });
});
