"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { TopPlayers } from "@/components/Tables/top-players";
import { TopPlayersSkeleton } from "@/components/Tables/top-players/skeleton";
import { Suspense } from "react";

const TablesPage = () => {
  return (
    <>
      <Breadcrumb pageName="Топ 100" />

      <div className="space-y-10">
        <Suspense fallback={<TopPlayersSkeleton />}>
          <TopPlayers />
        </Suspense>
      </div>
    </>
  );
};

export default TablesPage;
