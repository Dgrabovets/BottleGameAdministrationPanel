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
      year: "2-digit",
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

export function buildTimelineXAxisOptions(
  timeline: StatisticsTimeline,
  isMobile: boolean,
): ApexOptions["xaxis"] {
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
      formatter: (value) => formatAxisLabel(Number(value), timeline.bucket),
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
