"use client";
import { compactFormat } from "@/lib/format-number";
import { getOverviewData } from "../../fetch";
import { OverviewCard } from "./card";
import * as icons from "./icons";
import { useEffect, useState } from "react";

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
        const result = await getOverviewData();
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
          value: compactFormat(data.views.value),
        }}
        Icon={icons.Views}
      />

      <OverviewCard
        label="Доход"
        data={{
          ...data.profit,
          value: "$" + compactFormat(data.profit.value),
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
