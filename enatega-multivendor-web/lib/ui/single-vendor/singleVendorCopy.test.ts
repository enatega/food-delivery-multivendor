import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const SINGLE_VENDOR_COPY_KEYS = [
  "all_categories_label",
  "tab_deals",
  "tab_browse",
  "order_details_minimum_order_fee_label",
  "order_details_priority_delivery_fee_label",
  "order_details_credits_applied_label",
] as const;

describe("single-vendor navigation copy", () => {
  it("matches the customer app wording in English", () => {
    const english = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), "locales/en.json"), "utf8"),
    );

    expect(english.all_categories_label).toBe("All Categories");
    expect(english.tab_deals).toBe("Deals");
    expect(english.tab_browse).toBe("Browse");
  });

  it("defines every single-vendor label in every locale", () => {
    const localesDirectory = path.resolve(process.cwd(), "locales");

    for (const filename of fs
      .readdirSync(localesDirectory)
      .filter((file) => file.endsWith(".json"))) {
      const messages = JSON.parse(
        fs.readFileSync(path.join(localesDirectory, filename), "utf8"),
      );

      for (const key of SINGLE_VENDOR_COPY_KEYS) {
        expect(messages[key], `${filename}: ${key}`).toEqual(
          expect.any(String),
        );
        expect(messages[key].trim(), `${filename}: ${key}`).not.toBe("");
      }
    }
  });

  it("uses Deals rather than the generic discount label on discovery", () => {
    const discoverySource = fs.readFileSync(
      path.resolve(process.cwd(), "lib/ui/single-vendor/Discovery.tsx"),
      "utf8",
    );

    expect(discoverySource).toContain('t("tab_deals")');
    expect(discoverySource).not.toContain('t("discount_label")');
  });
});
