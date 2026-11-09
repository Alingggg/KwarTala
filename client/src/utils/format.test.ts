import { afterEach, describe, expect, it } from "vitest";
import { formatAxisTick, formatWeekRange } from "./format";

const originalTZ = process.env.TZ;

function useTimezone(tz: string) {
  process.env.TZ = tz;
}

afterEach(() => {
  if (originalTZ === undefined) delete process.env.TZ;
  else process.env.TZ = originalTZ;
});

const TIMEZONES = ["Asia/Manila", "UTC", "America/New_York", "Pacific/Honolulu"];

describe("formatWeekRange", () => {
  it("collapses the month when both dates share it", () => {
    expect(formatWeekRange("2026-11-01", "2026-11-07")).toBe("Nov. 1-7");
  });

  it("shows both months when the range crosses a month", () => {
    expect(formatWeekRange("2026-10-29", "2026-11-04")).toBe("Oct. 29 - Nov. 4");
  });

  it.each([...TIMEZONES, "Pacific/Kiritimati"])(
    "keeps date-only strings on their calendar day in %s",
    (tz) => {
      useTimezone(tz);
      expect(formatWeekRange("2026-11-01", "2026-11-07")).toBe("Nov. 1-7");
      expect(formatWeekRange("2026-11-29", "2026-11-30")).toBe("Nov. 29-30");
    },
  );
});

describe("formatAxisTick", () => {
  it.each([
    [0, "0"],
    [999, "999"],
    [1000, "1k"],
    [1500, "1.5k"],
    [10000, "10k"],
    [12500, "13k"],
    ["2000", "2k"],
  ])("formats %s as %s", (value, expected) => {
    expect(formatAxisTick(value)).toBe(expected);
  });

  it("passes non-numeric values through", () => {
    expect(formatAxisTick("Week 1")).toBe("Week 1");
  });
});
