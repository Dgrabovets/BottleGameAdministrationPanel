"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Players } from "@/components/Tables/players";
import { PlayersSkeleton } from "@/components/Tables/players/skeleton";
import { TopPlayers } from "@/components/Tables/top-players";
import { TopPlayersSkeleton } from "@/components/Tables/top-players/skeleton";

import { Suspense, useEffect, useState } from "react";

const TablesPage = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  if (!token) {
    return <div>No Auth</div>;
  }
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
