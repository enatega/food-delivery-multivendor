export const RTL_LANGUAGES = ["ar", "ur", "fa", "he"];
export function isRtl(lang: string) {
  return RTL_LANGUAGES.includes(lang);
}
