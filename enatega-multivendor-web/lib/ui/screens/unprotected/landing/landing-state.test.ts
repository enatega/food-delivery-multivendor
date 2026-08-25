import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  getJourneyStage,
  getNextLandingCategory,
  isMarketplaceLandingPath,
} from "./landing-state";

describe("Quiet Orbit landing state", () => {
  it("limits the simplified shell to the multi-vendor root route", () => {
    expect(isMarketplaceLandingPath("/", false)).toBe(true);
    expect(isMarketplaceLandingPath("/", true)).toBe(false);
    expect(isMarketplaceLandingPath("/discovery", false)).toBe(false);
    expect(isMarketplaceLandingPath("/product/123", false)).toBe(false);
  });

  it("maps scroll progress to the three approved journey stages", () => {
    expect(getJourneyStage(0)).toBe(0);
    expect(getJourneyStage(0.339)).toBe(0);
    expect(getJourneyStage(0.34)).toBe(1);
    expect(getJourneyStage(0.679)).toBe(1);
    expect(getJourneyStage(0.68)).toBe(2);
    expect(getJourneyStage(1)).toBe(2);
  });

  it("loops through every landing category in order", () => {
    expect(getNextLandingCategory("food")).toBe("groceries");
    expect(getNextLandingCategory("groceries")).toBe("essentials");
    expect(getNextLandingCategory("essentials")).toBe("food");
  });

  it("keeps the Landing translation schema complete in every locale", () => {
    const localesDirectory = path.resolve(process.cwd(), "locales");
    const english = JSON.parse(
      fs.readFileSync(path.join(localesDirectory, "en.json"), "utf8"),
    ).Landing;

    const keyPaths = (value: unknown, prefix = ""): string[] => {
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        return [prefix];
      }
      return Object.entries(value).flatMap(([key, child]) =>
        keyPaths(child, prefix ? `${prefix}.${key}` : key),
      );
    };

    const expectedKeys = keyPaths(english).sort();
    for (const filename of fs
      .readdirSync(localesDirectory)
      .filter((file) => file.endsWith(".json"))) {
      const messages = JSON.parse(
        fs.readFileSync(path.join(localesDirectory, filename), "utf8"),
      );
      expect(keyPaths(messages.Landing).sort(), filename).toEqual(expectedKeys);
    }
  });
});
