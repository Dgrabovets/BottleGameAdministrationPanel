"use client";

import {
  buildTimelineXAxisOptions,
  formatTooltipDate,
  toChartSeriesData,
} from "@/lib/chart-axis";
import { formatRub } from "@/lib/format-number";
import type { StatisticsTimeline } from "@/lib/statistics-types";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

/** Chart component loaded on the client only, because ApexCharts needs the browser */
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

/** Props of the income and deposits chart */
type Props = {
  timeline: StatisticsTimeline;
};

/** Line chart of income and deposits over the selected period */
export function IncomeDepositsChart({ timeline }: Props) {
  const isMobile = useIsMobile();

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 300,
      toolbar: { show: false },
      fontFamily: "inherit",
      zoom: { enabled: false },
    },
    colors: ["#5750F1", "#0ABEF9"],
    stroke: {
      curve: "smooth",
      width: isMobile ? 2 : 3,
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
    dataLabels: { enabled: false },
    grid: {
      strokeDashArray: 5,
    },
    xaxis: buildTimelineXAxisOptions(timeline, isMobile),
    yaxis: {
      labels: {
        formatter: (value) => formatRub(value, true),
      },
    },
    tooltip: {
      x: {
        formatter: (value) => formatTooltipDate(Number(value), timeline.bucket),
      },
      y: {
        formatter: (value) => formatRub(value),
      },
    },
  };

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
      <h3 className="mb-4 text-base font-semibold text-dark dark:text-white">
        Income and deposits
      </h3>
      <Chart
        options={options}
        series={[
          {
            name: "Income",
            data: toChartSeriesData(timeline, (point) => point.incomeAmount),
          },
          {
            name: "Deposits",
            data: toChartSeriesData(timeline, (point) => point.depositsAmount),
          },
        ]}
        type="line"
        height={300}
      />
    </div>
  );
}
