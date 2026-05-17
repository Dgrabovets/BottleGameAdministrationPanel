"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Withdraws } from "@/components/Tables/withdraws";
import { WithdrawsSkeleton } from "@/components/Tables/withdraws/skeleton";
import { Suspense } from "react";

const TablesPage = () => {
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
