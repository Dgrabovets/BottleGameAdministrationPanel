"use client";

import { formatChartDate } from "@/lib/date-range";
import type { StatisticsTimeline } from "@/lib/statistics-types";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type Props = {
  timeline: StatisticsTimeline;
};

export function UsersTimelineChart({ timeline }: Props) {
  const isMobile = useIsMobile();

  const categories = timeline.points.map((point) =>
    formatChartDate(point.date, timeline.bucket),
  );

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 300,
      toolbar: { show: false },
      fontFamily: "inherit",
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
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        rotate: -45,
        style: { fontSize: "11px" },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => Math.round(value).toString(),
      },
    },
    tooltip: {
      y: {
        formatter: (value) => `${Math.round(value)} игроков`,
      },
    },
  };

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
      <h3 className="mb-4 text-base font-semibold text-dark dark:text-white">
        Динамика кол-ва игроков
      </h3>
      <Chart
        options={options}
        series={[
          {
            name: "Игроки",
            data: timeline.points.map((point) => point.usersCount),
          },
        ]}
        type="area"
        height={300}
      />
    </div>
  );
}
