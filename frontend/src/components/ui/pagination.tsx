import { pageCount } from "@/lib/paging";
import { cn } from "@/lib/utils";

/** Props of the pagination bar */
type PaginationProps = {
  /** Current page, from 1 */
  page: number;
  pageSize: number;
  /** Number of items in the whole list */
  total: number;
  onChange: (page: number) => void;
  /** Disables the buttons while a page is loading */
  disabled?: boolean;
};

/** Previous and next buttons with the current page and the number of items, hidden when everything fits on one page */
export function Pagination({
  page,
  pageSize,
  total,
  onChange,
  disabled,
}: PaginationProps) {
  const pages = pageCount(total, pageSize);

  if (pages <= 1) return null;

  const button = (label: string, target: number, enabled: boolean) => (
    <button
      type="button"
      onClick={() => onChange(target)}
      disabled={disabled || !enabled}
      className={cn(
        "rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-dark transition dark:border-dark-3 dark:text-white",
        "hover:bg-gray-2 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-dark-3",
      )}
    >
      {label}
    </button>
  );

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between gap-4 px-6 py-4 xl:px-7.5"
    >
      <span className="text-sm text-dark-6">
        Page {page} of {pages}, {total} in total
      </span>
      <div className="flex gap-2">
        {button("Previous", page - 1, page > 1)}
        {button("Next", page + 1, page < pages)}
      </div>
    </nav>
  );
}
