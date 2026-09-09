import { describe, expect, it } from "vitest";
import { normalizeMediaUrl } from "./media-url";

const API_URL = "https://single-vendor.example.com/";

describe("normalizeMediaUrl", () => {
  it("maps an API public-media key to the managed media endpoint", () => {
    expect(normalizeMediaUrl("public-media/cart-item.jpg", API_URL)).toBe(
      "https://single-vendor.example.com/media/cart-item.jpg",
    );
  });

  it("keeps local application assets local", () => {
    expect(normalizeMediaUrl("/assets/images/fallback.jpg", API_URL)).toBe(
      "/assets/images/fallback.jpg",
    );
  });

  it("keeps external and inline image sources unchanged", () => {
    expect(
      normalizeMediaUrl("https://cdn.example.com/image.jpg", API_URL),
    ).toBe("https://cdn.example.com/image.jpg");
    expect(normalizeMediaUrl("data:image/png;base64,abc", API_URL)).toBe(
      "data:image/png;base64,abc",
    );
  });

  it("rehosts managed media URLs on the active API", () => {
    expect(
      normalizeMediaUrl(
        "https://old-api.example.com/media/cart-item.jpg?v=2",
        API_URL,
      ),
    ).toBe("https://single-vendor.example.com/media/cart-item.jpg?v=2");
  });

  it("normalizes other API-relative image paths", () => {
    expect(normalizeMediaUrl("uploads/item.jpg", API_URL)).toBe(
      "https://single-vendor.example.com/uploads/item.jpg",
    );
  });
});
