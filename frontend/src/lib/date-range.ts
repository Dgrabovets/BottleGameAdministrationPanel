import type { DateRange } from "@/lib/statistics-types";

/** Formats a date as YYYY-MM-DD for the API parameters */
export function formatDateParam(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Returns the default period: the last 30 days */
export function getDefaultPeriod(): DateRange {
  const till = new Date();
  till.setHours(0, 0, 0, 0);
  const from = new Date(till);
  from.setDate(from.getDate() - 29);
  return { from, till };
}

/** Returns the period of the given number of days that ends today */
export function getPresetPeriod(days: number): DateRange {
  const till = new Date();
  till.setHours(0, 0, 0, 0);
  const from = new Date(till);
  from.setDate(from.getDate() - (days - 1));
  return { from, till };
}

/** Formats a chart date for the bucket size */
export function formatChartDate(isoDate: string, bucket: string): string {
  const date = new Date(isoDate);
  if (bucket === "year") {
    return date.getFullYear().toString();
  }
  if (bucket === "month") {
    return date.toLocaleDateString("en-GB", {
      month: "short",
      year: "2-digit",
    });
  }
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
