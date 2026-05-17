"use client";

import { OverviewCardsGroup } from "./_components/overview-cards";

export default function Home() {
  return (
    <>
      <OverviewCardsGroup />

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5" />
    </>
  );
}
