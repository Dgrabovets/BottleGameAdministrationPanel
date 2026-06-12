import type { ApexOptions } from "apexcharts";
import type { StatisticsTimeline, StatisticsTimelinePoint } from "@/lib/statistics-types";

export function formatAxisLabel(timestamp: number, bucket: string): string {
  const date = new Date(timestamp);

  if (bucket === "year") {
    return date.getFullYear().toString();
  }

  if (bucket === "month") {
    return date.toLocaleDateString("ru-RU", {
      month: "short",
    });
  }

  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
}

export function formatTooltipDate(timestamp: number, bucket: string): string {
  const date = new Date(timestamp);

  if (bucket === "year") {
    return date.getFullYear().toString();
  }

  if (bucket === "month") {
    return date.toLocaleDateString("ru-RU", {
      month: "long",
      year: "numeric",
    });
  }

  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function spansMultipleYears(timeline: StatisticsTimeline): boolean {
  if (timeline.points.length === 0) return false;

  const years = timeline.points.map(
    (point) => new Date(point.date).getFullYear(),
  );

  return new Set(years).size > 1;
}

function buildYearBoundaryFormatter(timeline: StatisticsTimeline) {
  const multiYear = spansMultipleYears(timeline);
  const shownYears = new Set<number>();

  return (value: string) => {
    const date = new Date(Number(value));
    const year = date.getFullYear();
    const base = formatAxisLabel(Number(value), timeline.bucket);

    if (timeline.bucket === "year") {
      return String(year);
    }

    if (!multiYear) {
      return base;
    }

    const isYearBoundary =
      date.getMonth() === 0 &&
      (timeline.bucket === "month" || date.getDate() <= 7);

    if (!shownYears.has(year) || isYearBoundary) {
      shownYears.add(year);
      return `${base} ${year}`;
    }

    return base;
  };
}

export function buildTimelineXAxisOptions(
  timeline: StatisticsTimeline,
  isMobile: boolean,
): ApexOptions["xaxis"] {
  const formatter = buildYearBoundaryFormatter(timeline);

  return {
    type: "datetime",
    axisBorder: { show: false },
    axisTicks: { show: false },
    tickAmount: isMobile ? 5 : 8,
    labels: {
      hideOverlappingLabels: true,
      rotate: 0,
      datetimeUTC: false,
      style: { fontSize: "11px" },
      formatter,
    },
  };
}

export function toChartSeriesData(
  timeline: StatisticsTimeline,
  getY: (point: StatisticsTimelinePoint) => number,
) {
  return timeline.points.map((point) => ({
    x: new Date(point.date).getTime(),
    y: getY(point),
  }));
}
