"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Withdraws } from "@/components/Tables/withdraws";
import { WithdrawsSkeleton } from "@/components/Tables/withdraws/skeleton";

import { Metadata } from "next";
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
      <Breadcrumb pageName="Запросы на вывод" />

      <div className="space-y-10">
        <Suspense fallback={<WithdrawsSkeleton />}>
          <Withdraws />
        </Suspense>
      </div>
    </>
  );
};

export default TablesPage;
