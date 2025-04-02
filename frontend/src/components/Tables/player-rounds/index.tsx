import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { PlayerData } from "@/components/types";
import { useState } from "react";

interface PlayerRoundsProps {
  data: PlayerData;
}

export function PlayerRoundsTable({ data }: PlayerRoundsProps) {
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          История раундов
        </h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
            {/* <TableHead className="min-w-[155px] xl:pl-7.5">
              Пользователь
            </TableHead> */}
            <TableHead className="min-w-[155px] xl:pl-7.5">Сумма</TableHead>
            <TableHead>Дата окончания</TableHead>
            <TableHead>Статус</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.rounds?.map((item) => (
            <TableRow
              key={item.id}
              className="border-[#eee] dark:border-dark-3"
            >
              <TableCell className="min-w-[155px] font-medium xl:pl-7.5">
                <h5 className="text-dark dark:text-white">${item.bet}</h5>
              </TableCell>

              <TableCell>
                <p className="font-medium text-dark dark:text-white">
                  {new Date(item.finishedAt)
                    .toLocaleString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    .replace(/\//g, "-")}
                </p>
              </TableCell>

              <TableCell>
                <div
                  className={cn(
                    "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium",
                    {
                      "bg-[#219653]/[0.08] text-[#219653]": item.isWin === true,
                      "bg-[#D34053]/[0.08] text-[#D34053]":
                        item.isWin === false,
                    },
                  )}
                >
                  {item.isWin ? "Победа" : "Проигрыш"}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
