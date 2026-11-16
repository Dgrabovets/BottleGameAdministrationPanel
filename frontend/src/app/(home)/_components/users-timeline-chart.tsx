"use client";

import {
  buildTimelineXAxisOptions,
  formatTooltipDate,
  toChartSeriesData,
} from "@/lib/chart-axis";
import type { StatisticsTimeline } from "@/lib/statistics-types";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

/** Chart component loaded on the client only, because ApexCharts needs the browser */
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

/** Props of the players timeline chart */
type Props = {
  timeline: StatisticsTimeline;
};

/** Line chart of the number of players over the selected period */
export function UsersTimelineChart({ timeline }: Props) {
  const isMobile = useIsMobile();

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 300,
      toolbar: { show: false },
      fontFamily: "inherit",
      zoom: { enabled: false },
    },
    colors: ["#18BFFF"],
    stroke: {
      curve: "smooth",
      width: isMobile ? 2 : 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.45,
        opacityTo: 0.05,
      },
    },
    dataLabels: { enabled: false },
    grid: {
      strokeDashArray: 5,
    },
    xaxis: buildTimelineXAxisOptions(timeline, isMobile),
    yaxis: {
      labels: {
        formatter: (value) => Math.round(value).toString(),
      },
    },
    tooltip: {
      x: {
        formatter: (value) => formatTooltipDate(Number(value), timeline.bucket),
      },
      y: {
        formatter: (value) => String(Math.round(value)),
      },
    },
  };

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
      <h3 className="mb-4 text-base font-semibold text-dark dark:text-white">
        Number of players over time
      </h3>
      <Chart
        options={options}
        series={[
          {
            name: "Players",
            data: toChartSeriesData(timeline, (point) => point.usersCount),
          },
        ]}
        type="area"
        height={300}
      />
    </div>
  );
}
