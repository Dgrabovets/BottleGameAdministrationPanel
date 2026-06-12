"use client";

import { formatDateParam, getPresetPeriod } from "@/lib/date-range";
import type { DateRange } from "@/lib/statistics-types";

type Props = {
  value: DateRange;
  onChange: (range: DateRange) => void;
  onApply: () => void;
  onPreset?: (range: DateRange) => void;
};

function parseInputDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function DateRangeFilter({
  value,
  onChange,
  onApply,
  onPreset,
}: Props) {
  const applyPreset = (days: number) => {
    const range = getPresetPeriod(days);
    onChange(range);
    onPreset?.(range);
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-[180px] flex-1">
          <label className="mb-2 block text-sm font-medium text-dark-6">
            Начало периода
          </label>
          <input
            type="date"
            value={formatDateParam(value.from)}
            onChange={(event) =>
              onChange({
                from: parseInputDate(event.target.value),
                till: value.till,
              })
            }
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        <div className="min-w-[180px] flex-1">
          <label className="mb-2 block text-sm font-medium text-dark-6">
            Конец периода
          </label>
          <input
            type="date"
            value={formatDateParam(value.till)}
            onChange={(event) =>
              onChange({
                from: value.from,
                till: parseInputDate(event.target.value),
              })
            }
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        <button
          type="button"
          onClick={onApply}
          className="rounded-lg bg-dark px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-dark"
        >
          Применить
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-dark-6">Таймлайн:</span>
        <button
          type="button"
          onClick={() => applyPreset(30)}
          className="rounded-lg border border-stroke px-3 py-1.5 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
        >
          30 дней
        </button>
        <button
          type="button"
          onClick={() => {
            const till = new Date();
            till.setHours(0, 0, 0, 0);
            const from = new Date(till);
            from.setMonth(from.getMonth() - 11);
            from.setDate(1);
            const range = { from, till };
            onChange(range);
            onPreset?.(range);
          }}
          className="rounded-lg border border-stroke px-3 py-1.5 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
        >
          12 месяцев
        </button>
      </div>
    </div>
  );
}
