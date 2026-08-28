import type { ISingleVendorDashboardCatalogResponseGraphQL } from '@/lib/utils/interfaces';

const MONTHS_IN_YEAR = 12;

function parseCreatedAt(value: string): Date | null {
  const numericValue = Number(value);
  const date = new Date(Number.isFinite(numericValue) ? numericValue : value);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function getSingleVendorDashboardMetrics(
  data: ISingleVendorDashboardCatalogResponseGraphQL | null | undefined,
  year = new Date().getFullYear()
) {
  const categoriesById = new Map<string, string>();
  const productsById = new Map<string, string>();

  data?.restaurants?.forEach((restaurant) => {
    restaurant.categories?.forEach((category) => {
      categoriesById.set(category._id, category.createdAt);
      category.foods?.forEach((food) => {
        productsById.set(food._id, food.createdAt);
      });
    });
  });

  const getMonthlyCounts = (records: Map<string, string>) => {
    const monthlyCounts = new Array<number>(MONTHS_IN_YEAR).fill(0);

    records.forEach((createdAt) => {
      const date = parseCreatedAt(createdAt);
      if (date?.getFullYear() === year) {
        monthlyCounts[date.getMonth()] += 1;
      }
    });

    return monthlyCounts;
  };

  return {
    productsCount: productsById.size,
    categoriesCount: categoriesById.size,
    productsByMonth: getMonthlyCounts(productsById),
    categoriesByMonth: getMonthlyCounts(categoriesById),
  };
}
