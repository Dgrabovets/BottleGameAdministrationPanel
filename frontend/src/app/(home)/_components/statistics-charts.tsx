import type { StatisticsTimeline } from "@/lib/statistics-types";
import { IncomeDepositsChart } from "./income-deposits-chart";
import { UsersTimelineChart } from "./users-timeline-chart";

type Props = {
  timeline: StatisticsTimeline | null;
  loading?: boolean;
};

export function StatisticsCharts({ timeline, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-[360px] animate-pulse rounded-[10px] bg-gray-3 dark:bg-dark-2" />
        <div className="h-[360px] animate-pulse rounded-[10px] bg-gray-3 dark:bg-dark-2" />
      </div>
    );
  }

  if (!timeline || timeline.points.length === 0) {
    return (
      <p className="text-sm text-dark-6">Нет данных за выбранный период</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <UsersTimelineChart timeline={timeline} />
      <IncomeDepositsChart timeline={timeline} />
    </div>
  );
}
