import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
};

export function StatisticsSection({ title, children, className, footer }: Props) {
  return (
    <section
      className={cn(
        "rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark",
        className,
      )}
    >
      <h2 className="mb-6 text-lg font-semibold text-dark dark:text-white">
        {title}
      </h2>
      {children}
      {footer ? (
        <p className="mt-4 text-sm text-dark-6">{footer}</p>
      ) : null}
    </section>
  );
}
