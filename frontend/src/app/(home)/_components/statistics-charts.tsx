import type { StatisticsTimeline } from "@/lib/statistics-types";
import { IncomeDepositsChart } from "./income-deposits-chart";
import { UsersTimelineChart } from "./users-timeline-chart";

/** Props of the statistics charts block */
type Props = {
  timeline: StatisticsTimeline | null;
  loading?: boolean;
};

/** Block with the timeline charts and an empty state */
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
      <p className="text-sm text-dark-6">No data for the selected period</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <UsersTimelineChart timeline={timeline} />
      <IncomeDepositsChart timeline={timeline} />
    </div>
  );
}
