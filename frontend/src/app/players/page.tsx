"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Players } from "@/components/Tables/players";
import { PlayersSkeleton } from "@/components/Tables/players/skeleton";

import { Suspense, useEffect, useState } from "react";

const TablesPage = () => {
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    setAuthToken(localStorage.getItem("token")); // Читаем `localStorage` только в браузере
  }, []);

  if (!authToken) {
    return <div>No Auth</div>;
  }
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
