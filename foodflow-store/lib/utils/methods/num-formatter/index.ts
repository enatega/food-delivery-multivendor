// Large Number Formatter
export default function formatNumber(num: number) {
  if (num >= 1_000_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "T";
  } else if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  } else if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  } else {
    return num.toString();
  }
}
