"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { TopPlayers } from "@/components/Tables/top-players";
import { TopPlayersSkeleton } from "@/components/Tables/top-players/skeleton";
import { Suspense } from "react";

/** Top players page */
const TablesPage = () => {
  return (
    <>
      <Breadcrumb pageName="Top 100" />

      <div className="space-y-10">
        <Suspense fallback={<TopPlayersSkeleton />}>
          <TopPlayers />
        </Suspense>
      </div>
    </>
  );
};

export default TablesPage;
