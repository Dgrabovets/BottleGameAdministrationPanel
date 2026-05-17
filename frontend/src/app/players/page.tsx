"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Players } from "@/components/Tables/players";
import { PlayersSkeleton } from "@/components/Tables/players/skeleton";
import { Suspense } from "react";

const TablesPage = () => {
  return (
    <>
      <Breadcrumb pageName="Игроки" />

      <div className="space-y-10">
        <Suspense fallback={<PlayersSkeleton />}>
          <Players />
        </Suspense>
      </div>
    </>
  );
};

export default TablesPage;
