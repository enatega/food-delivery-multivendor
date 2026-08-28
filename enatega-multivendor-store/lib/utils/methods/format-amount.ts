export const formatAmount = (value: unknown, fractionDigits = 2) => {
  const amount = typeof value === "number" ? value : Number(value);
  return Number.isFinite(amount)
    ? amount.toFixed(fractionDigits)
    : (0).toFixed(fractionDigits);
};
