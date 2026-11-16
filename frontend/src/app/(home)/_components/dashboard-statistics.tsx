"use client";

import { settingsApi } from "@/api/settingsApi";
import { formatDateParam, getDefaultPeriod } from "@/lib/date-range";
import { compactFormat, formatRub } from "@/lib/format-number";
import type {
  AppStatistics,
  DateRange,
  StatisticsTimeline,
} from "@/lib/statistics-types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DateRangeFilter } from "./date-range-filter";
import * as icons from "./overview-cards/icons";
import { OverviewCardsRow } from "./overview-cards/overview-cards-row";
import { OverviewCardsSkeleton } from "./overview-cards/skeleton";
import { StatisticsCharts } from "./statistics-charts";
import { StatisticsSection } from "./statistics-section";

/** How often the dashboard refreshes the statistics, in milliseconds */
const POLL_INTERVAL_MS = 5_000;

/** Takes a readable message from an Axios error, or returns the fallback */
function extractErrorMessage(error: unknown, fallback: string): string {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response
  ) {
    const data = error.response.data;
    if (typeof data === "string" && data.length > 0) return data;
    if (data && typeof data === "object") {
      const message =
        (data as Record<string, unknown>).message ??
        (data as Record<string, unknown>).title ??
        (data as Record<string, unknown>).error;
      if (typeof message === "string" && message.length > 0) return message;
    }
  }
  return fallback;
}

/** Dashboard: the date range filter, the overview cards and the charts */
export function DashboardStatistics() {
  const [generalStats, setGeneralStats] = useState<AppStatistics | null>(null);
  const [periodStats, setPeriodStats] = useState<AppStatistics | null>(null);
  const [timeline, setTimeline] = useState<StatisticsTimeline | null>(null);

  const [draftRange, setDraftRange] = useState<DateRange>(getDefaultPeriod);
  const [appliedRange, setAppliedRange] = useState<DateRange>(getDefaultPeriod);

  const [initialLoading, setInitialLoading] = useState(true);
  const [periodLoading, setPeriodLoading] = useState(true);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [periodError, setPeriodError] = useState<string | null>(null);
  const hasLoadedOnceRef = useRef(false);

  const loadStatistics = useCallback(
    async (range: DateRange, options?: { silent?: boolean }) => {
      const silent = options?.silent ?? false;

      if (!silent) {
        setPeriodLoading(true);
        if (!hasLoadedOnceRef.current) {
          setInitialLoading(true);
        }
      }

      setGeneralError(null);
      setPeriodError(null);

      const params = {
        dateFrom: formatDateParam(range.from),
        dateTill: formatDateParam(range.till),
      };

      try {
        const [general, period, timelineData] = await Promise.all([
          settingsApi.getStatistics(),
          settingsApi.getStatistics(params),
          settingsApi.getStatisticsTimeline(params),
        ]);

        setGeneralStats(general);
        setPeriodStats(period);
        setTimeline(timelineData);
      } catch (error) {
        const message = extractErrorMessage(
          error,
          "Failed to load the statistics",
        );
        setGeneralError(message);
        setPeriodError(message);
        if (!silent) {
          setPeriodStats(null);
          setTimeline(null);
        }
      } finally {
        hasLoadedOnceRef.current = true;
        if (!silent) {
          setPeriodLoading(false);
          setInitialLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;

    const run = async (silent: boolean) => {
      if (cancelled) return;
      await loadStatistics(appliedRange, { silent });
    };

    run(false);

    const intervalId = window.setInterval(() => {
      run(true);
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [appliedRange, loadStatistics]);

  const applyRange = useCallback((range: DateRange) => {
    setDraftRange(range);
    setAppliedRange(range);
  }, []);

  const handleApply = () => {
    applyRange(draftRange);
  };

  const generalCards = useMemo(() => {
    if (!generalStats) return [];
    return [
      {
        label: "Total player balance",
        value: formatRub(generalStats.balancesTotal ?? 0, true),
        Icon: icons.TreasureChest,
      },
      {
        label: "Income",
        value: formatRub(generalStats.incomeTotal, true),
        Icon: icons.Profit,
      },
      {
        label: "Deposits",
        value: formatRub(generalStats.depositsTotal, true),
        Icon: icons.Deposits,
      },
      {
        label: "Number of players",
        value: compactFormat(generalStats.usersTotal),
        Icon: icons.Users,
      },
      {
        label: "Withdrawals in progress",
        value: formatRub(generalStats.pendingWithdrawalsTotal ?? 0, true),
        Icon: icons.PendingWithdrawals,
      },
    ];
  }, [generalStats]);

  const periodCards = useMemo(() => {
    if (!periodStats) return [];
    return [
      {
        label: "Income",
        value: formatRub(periodStats.incomeTotal, true),
        Icon: icons.Profit,
      },
      {
        label: "Deposits",
        value: formatRub(periodStats.depositsTotal, true),
        Icon: icons.Deposits,
      },
      {
        label: "Number of players",
        value: compactFormat(periodStats.usersTotal),
        Icon: icons.Users,
      },
    ];
  }, [periodStats]);

  return (
    <div className="space-y-6 md:space-y-8">
      <StatisticsSection title="General statistics">
        {initialLoading ? (
          <OverviewCardsSkeleton
            count={5}
            columnsClassName="sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
          />
        ) : generalError ? (
          <p className="text-sm text-red">{generalError}</p>
        ) : (
          <OverviewCardsRow
            items={generalCards}
            columnsClassName="sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
          />
        )}
      </StatisticsSection>

      <StatisticsSection
        title="Statistics over time"
        footer="Refreshes every 5 seconds for the selected period"
      >
        <DateRangeFilter
          value={draftRange}
          onChange={setDraftRange}
          onApply={handleApply}
          onPreset={applyRange}
        />
        {periodLoading ? (
          <OverviewCardsSkeleton
            count={3}
            columnsClassName="sm:grid-cols-2 xl:grid-cols-3"
          />
        ) : periodError ? (
          <p className="text-sm text-red">{periodError}</p>
        ) : (
          <OverviewCardsRow
            items={periodCards}
            columnsClassName="sm:grid-cols-2 xl:grid-cols-3"
          />
        )}
      </StatisticsSection>

      <StatisticsSection title="Trend charts">
        <StatisticsCharts timeline={timeline} loading={periodLoading} />
      </StatisticsSection>
    </div>
  );
}
