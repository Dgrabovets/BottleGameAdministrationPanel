/** One page of a list together with the size of the whole list */
export type Page<T> = {
  items: T[];
  total: number;
};

/** Reads the X-Total-Count header of a response, falls back to the given count when it is missing */
export function readTotalCount(
  headers: Record<string, unknown>,
  fallback: number,
): number {
  const value = Number(headers["x-total-count"]);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

/** Number of pages for a list of the given size, at least one */
export function pageCount(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(total / pageSize));
}
