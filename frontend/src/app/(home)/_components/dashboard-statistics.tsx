"use client";

import { settingsApi } from "@/api/settingsApi";
import { formatDateParam, getDefaultPeriod } from "@/lib/date-range";
import { compactFormat, formatRub } from "@/lib/format-number";
import type { AppStatistics, DateRange, StatisticsTimeline } from "@/lib/statistics-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DateRangeFilter } from "./date-range-filter";
import * as icons from "./overview-cards/icons";
import { OverviewCardsRow } from "./overview-cards/overview-cards-row";
import { OverviewCardsSkeleton } from "./overview-cards/skeleton";
import { StatisticsCharts } from "./statistics-charts";
import { StatisticsSection } from "./statistics-section";

export function DashboardStatistics() {
  const [generalStats, setGeneralStats] = useState<AppStatistics | null>(null);
  const [periodStats, setPeriodStats] = useState<AppStatistics | null>(null);
  const [timeline, setTimeline] = useState<StatisticsTimeline | null>(null);

  const [draftRange, setDraftRange] = useState<DateRange>(getDefaultPeriod);
  const [appliedRange, setAppliedRange] = useState<DateRange>(getDefaultPeriod);

  const [generalLoading, setGeneralLoading] = useState(true);
  const [periodLoading, setPeriodLoading] = useState(true);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [periodError, setPeriodError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadGeneral() {
      setGeneralLoading(true);
      setGeneralError(null);
      try {
        const stats = await settingsApi.getStatistics();
        if (!cancelled) setGeneralStats(stats);
      } catch {
        if (!cancelled) setGeneralError("Не удалось загрузить общую статистику");
      } finally {
        if (!cancelled) setGeneralLoading(false);
      }
    }

    loadGeneral();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadPeriodData = useCallback(async (range: DateRange) => {
    setPeriodLoading(true);
    setPeriodError(null);
    const params = {
      dateFrom: formatDateParam(range.from),
      dateTill: formatDateParam(range.till),
    };

    try {
      const [stats, timelineData] = await Promise.all([
        settingsApi.getStatistics(params),
        settingsApi.getStatisticsTimeline(params),
      ]);
      setPeriodStats(stats);
      setTimeline(timelineData);
    } catch {
      setPeriodError("Не удалось загрузить статистику за период");
      setPeriodStats(null);
      setTimeline(null);
    } finally {
      setPeriodLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPeriodData(appliedRange);
  }, [appliedRange, loadPeriodData]);

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
        label: "Суммарный баланс игроков",
        value: formatRub(generalStats.balancesTotal ?? 0, true),
        Icon: icons.Wallet,
      },
      {
        label: "Доход",
        value: formatRub(generalStats.incomeTotal, true),
        Icon: icons.Profit,
      },
      {
        label: "Пополнения",
        value: formatRub(generalStats.depositsTotal, true),
        Icon: icons.Deposits,
      },
      {
        label: "Кол-во игроков",
        value: compactFormat(generalStats.usersTotal),
        Icon: icons.Users,
      },
      {
        label: "Выводы в обработке",
        value: formatRub(generalStats.pendingWithdrawalsTotal ?? 0, true),
        Icon: icons.PendingWithdrawals,
      },
    ];
  }, [generalStats]);

  const periodCards = useMemo(() => {
    if (!periodStats) return [];
    return [
      {
        label: "Доход",
        value: formatRub(periodStats.incomeTotal, true),
        Icon: icons.Profit,
      },
      {
        label: "Пополнения",
        value: formatRub(periodStats.depositsTotal, true),
        Icon: icons.Deposits,
      },
      {
        label: "Кол-во игроков",
        value: compactFormat(periodStats.usersTotal),
        Icon: icons.Users,
      },
    ];
  }, [periodStats]);

  return (
    <div className="space-y-6 md:space-y-8">
      <StatisticsSection title="Общая статистика">
        {generalLoading ? (
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
        title="Статистика во времени"
        footer="Обновляется по выбранному периоду"
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

      <StatisticsSection title="Графики динамики">
        <StatisticsCharts timeline={timeline} loading={periodLoading} />
      </StatisticsSection>
    </div>
  );
}
