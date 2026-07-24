import { getIsAcceptButtonVisible } from "./gloabl";

describe("getIsAcceptButtonVisible", () => {
  it("becomes visible within the five-minute grace period", () => {
    jest
      .spyOn(Date, "now")
      .mockReturnValue(new Date("2026-07-23T10:00:00Z").getTime());

    expect(getIsAcceptButtonVisible("2026-07-23T10:04:59Z")).toBe(true);
    expect(getIsAcceptButtonVisible("2026-07-23T10:05:01Z")).toBe(false);
  });
});
