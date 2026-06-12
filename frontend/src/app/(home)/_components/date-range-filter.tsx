"use client";

import { Calendar } from "@/components/Layouts/sidebar/icons";
import { formatDateParam, getPresetPeriod } from "@/lib/date-range";
import type { DateRange } from "@/lib/statistics-types";
import flatpickr from "flatpickr";
import { Russian } from "flatpickr/dist/l10n/ru.js";
import { useEffect, useRef } from "react";

type Props = {
  value: DateRange;
  onChange: (range: DateRange) => void;
  onApply: () => void;
  onPreset?: (range: DateRange) => void;
};

const INPUT_HEIGHT_CLASS =
  "h-11 rounded-lg border border-stroke bg-transparent px-4 text-sm text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white";

export function DateRangeFilter({
  value,
  onChange,
  onApply,
  onPreset,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<flatpickr.Instance | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    pickerRef.current = flatpickr(inputRef.current, {
      mode: "range",
      locale: Russian,
      showMonths: 2,
      monthSelectorType: "dropdown",
      dateFormat: "d.m.Y",
      maxDate: "today",
      defaultDate: [value.from, value.till],
      onChange: (selectedDates) => {
        if (selectedDates.length === 0) return;

        const from = selectedDates[0];
        const till = selectedDates[1] ?? selectedDates[0];
        from.setHours(0, 0, 0, 0);
        till.setHours(0, 0, 0, 0);
        onChange({ from, till });
      },
    });

    return () => {
      pickerRef.current?.destroy();
      pickerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init once
  }, []);

  useEffect(() => {
    pickerRef.current?.setDate([value.from, value.till], false);
  }, [value.from, value.till]);

  const applyPreset = (days: number) => {
    const range = getPresetPeriod(days);
    onChange(range);
    onPreset?.(range);
  };

  return (
    <div className="statistics-date-range mb-6 space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="min-w-[260px] flex-1">
          <label className="mb-2 block text-sm font-medium text-dark-6">
            Период
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              readOnly
              placeholder="Выберите даты"
              defaultValue={`${formatDateParam(value.from)} — ${formatDateParam(value.till)}`}
              className={`w-full cursor-pointer pr-11 ${INPUT_HEIGHT_CLASS}`}
            />
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-dark-5">
              <Calendar className="size-5" />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onApply}
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Применить
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-dark-6">Быстрый выбор:</span>
        <button
          type="button"
          onClick={() => applyPreset(30)}
          className="rounded-full border border-stroke px-3.5 py-1.5 text-sm font-medium text-dark transition hover:border-primary hover:text-primary dark:border-dark-3 dark:text-white"
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
          className="rounded-full border border-stroke px-3.5 py-1.5 text-sm font-medium text-dark transition hover:border-primary hover:text-primary dark:border-dark-3 dark:text-white"
        >
          12 месяцев
        </button>
      </div>
    </div>
  );
}
