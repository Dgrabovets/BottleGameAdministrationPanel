"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Withdraws } from "@/components/Tables/withdraws";
import { WithdrawsSkeleton } from "@/components/Tables/withdraws/skeleton";
import { Suspense } from "react";

/** Withdrawal requests page */
const TablesPage = () => {
  return (
    <>
      <Breadcrumb pageName="Withdrawal requests" />

      <div className="space-y-10">
        <Suspense fallback={<WithdrawsSkeleton />}>
          <Withdraws />
        </Suspense>
      </div>
    </>
  );
};

export default TablesPage;
