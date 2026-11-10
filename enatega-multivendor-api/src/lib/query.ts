/** Shared helpers for list queries. */

export const MAX_PAGE_SIZE = 200;

export function pageArgs(page?: number | null, limit?: number | null, defaultLimit = 10) {
  const l = Math.min(Math.max(Number(limit) || defaultLimit, 1), MAX_PAGE_SIZE);
  const p = Math.max(Number(page) || 1, 1);
  return { page: p, limit: l, skip: (p - 1) * l };
}

export function offsetArgs(offset?: number | null, limit?: number | null, defaultLimit = 20) {
  const l = Math.min(Math.max(Number(limit) || defaultLimit, 1), MAX_PAGE_SIZE);
  return { skip: Math.max(Number(offset) || 0, 0), limit: l };
}

export function pageResult<T>(data: T[], totalCount: number, page: number, limit: number) {
  const totalPages = Math.max(Math.ceil(totalCount / limit), 1);
  return {
    data,
    totalCount,
    currentPage: page,
    totalPages,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  };
}

export const escapeRegex = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Case-insensitive "contains" regex for user-provided search strings (length-capped). */
export function searchRegex(search?: string | null): RegExp | undefined {
  const s = search?.trim();
  if (!s) return undefined;
  return new RegExp(escapeRegex(s.slice(0, 100)), 'i');
}

function parseDate(v?: string | null): Date | undefined {
  if (!v) return undefined;
  const d = /^\d{10,}$/.test(v) ? new Date(Number(v)) : new Date(v);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

/**
 * Resolves the dashboard date filters (`dateKeyword` = All | Today | Week | Month | Year | Custom,
 * plus optional explicit start/end) into a Mongo date range, or undefined for "all time".
 */
export function dateRange(keyword?: string | null, start?: string | null, end?: string | null): { $gte?: Date; $lte?: Date } | undefined {
  const k = (keyword ?? '').toLowerCase();
  const now = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  switch (k) {
    case 'today':
      return { $gte: startOfDay(now), $lte: now };
    case 'week': {
      const d = startOfDay(now);
      d.setDate(d.getDate() - 6);
      return { $gte: d, $lte: now };
    }
    case 'month': {
      const d = startOfDay(now);
      d.setDate(d.getDate() - 29);
      return { $gte: d, $lte: now };
    }
    case 'year': {
      const d = startOfDay(now);
      d.setFullYear(d.getFullYear() - 1);
      return { $gte: d, $lte: now };
    }
    case 'all':
      return undefined;
    default: {
      const s = parseDate(start);
      let e = parseDate(end);
      if (e && end && /^\d{4}-\d{2}-\d{2}$/.test(end)) e = new Date(e.getTime() + 24 * 3600 * 1000 - 1);
      if (!s && !e) return undefined;
      return { ...(s ? { $gte: s } : {}), ...(e ? { $lte: e } : {}) };
    }
  }
}

export const round2 = (n: number): number => Math.round((Number(n) || 0) * 100) / 100;

export const yearRange = (year: number) => ({ $gte: new Date(year, 0, 1), $lt: new Date(year + 1, 0, 1) });

/** Fills a 12-element monthly series from aggregation rows `{ _id: month(1..12), value }`. */
export function monthlySeries(rows: { _id: number; value: number }[]): number[] {
  const out = Array.from({ length: 12 }, () => 0);
  for (const r of rows) if (r._id >= 1 && r._id <= 12) out[r._id - 1] = round2(r.value);
  return out;
}
