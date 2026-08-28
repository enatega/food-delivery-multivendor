export const parseTimestamp = (value: unknown): Date | null => {
  let candidate = value;

  if (
    candidate &&
    typeof candidate === "object" &&
    !(candidate instanceof Date)
  ) {
    const serialized = candidate as Record<string, unknown>;
    candidate = serialized.$date ?? serialized.date ?? serialized.value;
  }

  if (typeof candidate === "string" && /^\d+$/.test(candidate.trim())) {
    candidate = Number(candidate);
  }
  if (typeof candidate === "number" && candidate < 1e12) {
    candidate *= 1000;
  }
  if (
    !(candidate instanceof Date) &&
    typeof candidate !== "string" &&
    typeof candidate !== "number"
  ) {
    return null;
  }

  const date = candidate instanceof Date ? candidate : new Date(candidate);
  return Number.isFinite(date.getTime()) ? date : null;
};

export const formatTimestampTime = (value: unknown): string | null =>
  parseTimestamp(value)?.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }) ?? null;
