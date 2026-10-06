import {
  hasCompleteRiderSession,
  isInvalidRiderSessionError,
  publishSessionInvalidation,
  subscribeToSessionInvalidation,
} from "./session";

describe("rider session invalidation", () => {
  it("requires both a token and rider id to restore a session", () => {
    expect(hasCompleteRiderSession("token", "rider-id")).toBe(true);
    expect(hasCompleteRiderSession("token", null)).toBe(false);
    expect(hasCompleteRiderSession(null, "rider-id")).toBe(false);
  });

  it.each(["UNAUTHENTICATED", "TOKEN_EXPIRED", "INVALID_TOKEN"])(
    "recognizes %s as an invalid rider session",
    (code) => {
      expect(
        isInvalidRiderSessionError({ message: "request failed", extensions: { code } }),
      ).toBe(true);
    },
  );

  it("does not log the rider out for public proof gateway failures", () => {
    expect(
      isInvalidRiderSessionError({ message: "Unauthorized: invalid token" }),
    ).toBe(false);
    expect(
      isInvalidRiderSessionError({ message: "Public token fingerprint mismatch" }),
    ).toBe(false);
  });

  it("invalidates a mismatched or deleted rider profile", () => {
    expect(
      isInvalidRiderSessionError(
        { message: "Not authorized", extensions: { code: "FORBIDDEN" } },
        "rider",
      ),
    ).toBe(true);
    expect(
      isInvalidRiderSessionError({ message: "Rider does not exist" }, "rider"),
    ).toBe(true);
  });

  it("publishes invalidation to active authentication providers", () => {
    const listener = jest.fn(() => true);
    const unsubscribe = subscribeToSessionInvalidation(listener);
    const event = { riderIdKey: "rider-id", tokenKey: "rider-token" };

    expect(publishSessionInvalidation(event)).toBe(1);
    expect(listener).toHaveBeenCalledWith(event);

    unsubscribe();
    expect(publishSessionInvalidation(event)).toBe(0);
  });

  it("reports an invalidation as unhandled when only another mode is active", () => {
    const unsubscribe = subscribeToSessionInvalidation(() => false);

    expect(
      publishSessionInvalidation({
        riderIdKey: "single-rider-id",
        tokenKey: "single-rider-token",
      }),
    ).toBe(0);

    unsubscribe();
  });
});
