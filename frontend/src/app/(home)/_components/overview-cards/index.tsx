"use client";
import { compactFormat, formatRub } from "@/lib/format-number";
import { getOverviewData } from "../../fetch";
import { OverviewCard } from "./card";
import * as icons from "./icons";
import { useEffect, useState } from "react";
import { settingsApi } from "@/api/settingsApi";

type OverviewData = {
  views: { value: number; growthRate: number };
  profit: { value: number; growthRate: number };
  products: { value: number; growthRate: number };
  users: { value: number; growthRate: number };
};

export function OverviewCardsGroup() {
  const [data, setData] = useState<OverviewData | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const stats = await settingsApi.getStatistics(); // ← правильный вызов

        const result = {
          views: {
            value: stats.balancesTotal,
            growthRate: 0, // можешь заменить на актуальное значение, если появится
          },
          profit: {
            value: stats.depositsTotal,
            growthRate: 0,
          },
          products: {
            value: stats.pendingWithdrawalsTotal,
            growthRate: 0,
          },
          users: {
            value: stats.usersTotal,
            growthRate: 0,
          },
        };

        setData(result);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p>Загрузка...</p>;

  if (!data) {
    return <div>no data</div>;
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <OverviewCard
        label="Посетители"
        data={{
          ...data.views,
          value: formatRub(data.views.value, true),
        }}
        Icon={icons.Views}
      />

      <OverviewCard
        label="Доход"
        data={{
          ...data.profit,
          value: formatRub(data.profit.value, true),
        }}
        Icon={icons.Profit}
      />

      <OverviewCard
        label="Пользователи"
        data={{
          ...data.users,
          value: compactFormat(data.users.value),
        }}
        Icon={icons.Users}
      />
    </div>
  );
}
