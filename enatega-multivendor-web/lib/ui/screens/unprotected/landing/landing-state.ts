export const isMarketplaceLandingPath = (
  pathname: string | null,
  isSingleVendor = false,
) => pathname === "/" && !isSingleVendor;

export const getJourneyStage = (progress: number) => {
  if (progress < 0.34) return 0;
  if (progress < 0.68) return 1;
  return 2;
};

export const LANDING_CATEGORY_IDS = [
  "food",
  "groceries",
  "essentials",
] as const;

export type LandingCategoryId = (typeof LANDING_CATEGORY_IDS)[number];

export const getNextLandingCategory = (
  current: LandingCategoryId,
): LandingCategoryId => {
  const currentIndex = LANDING_CATEGORY_IDS.indexOf(current);
  return LANDING_CATEGORY_IDS[(currentIndex + 1) % LANDING_CATEGORY_IDS.length];
};
