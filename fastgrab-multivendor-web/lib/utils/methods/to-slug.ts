export function toSlug(input: string): string {
  if (!input) return "";
  return input
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, "-"); // Replace spaces with hyphens
}
