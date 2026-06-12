import type { DateRange } from "@/lib/statistics-types";

export function formatDateParam(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDefaultPeriod(): DateRange {
  const till = new Date();
  till.setHours(0, 0, 0, 0);
  const from = new Date(till);
  from.setDate(from.getDate() - 29);
  return { from, till };
}

export function getPresetPeriod(days: number): DateRange {
  const till = new Date();
  till.setHours(0, 0, 0, 0);
  const from = new Date(till);
  from.setDate(from.getDate() - (days - 1));
  return { from, till };
}

export function formatChartDate(isoDate: string, bucket: string): string {
  const date = new Date(isoDate);
  if (bucket === "month") {
    return date.toLocaleDateString("ru-RU", { month: "short", year: "2-digit" });
  }
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}
