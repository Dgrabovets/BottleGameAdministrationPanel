import type { JSX, SVGProps } from "react";
import { OverviewCard } from "./card";

/** Data of one overview card */
export type OverviewCardItem = {
  label: string;
  value: string | number;
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
};

/** Props of the row of overview cards */
type Props = {
  items: OverviewCardItem[];
  columnsClassName?: string;
};

/** Row of overview cards, shows skeletons while the data loads */
export function OverviewCardsRow({
  items,
  columnsClassName = "sm:grid-cols-2 xl:grid-cols-4",
}: Props) {
  return (
    <div className={`grid gap-4 sm:gap-6 2xl:gap-7.5 ${columnsClassName}`}>
      {items.map((item) => (
        <OverviewCard
          key={item.label}
          label={item.label}
          data={{ value: item.value, growthRate: 0 }}
          Icon={item.Icon}
        />
      ))}
    </div>
  );
}
