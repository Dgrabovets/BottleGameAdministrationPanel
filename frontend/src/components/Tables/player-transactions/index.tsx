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
import Link from "next/link";
import Image from "next/image";

interface PlayerTransactionsProps {
  data: PlayerData;
}

export function PlayerTransactionsTable({ data }: PlayerTransactionsProps) {
  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          История транзакций
        </h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
            <TableHead className="min-w-[155px] xl:pl-7.5">Сумма</TableHead>
            <TableHead>Дата транзакции</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Тип транзакции</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.transactions?.map((item) => (
            <TableRow
              key={item.id}
              className="border-[#eee] dark:border-dark-3"
            >
              <TableCell className="min-w-[155px] font-medium xl:pl-7.5">
                <h5 className="text-dark dark:text-white">${item.amount}</h5>
              </TableCell>

              <TableCell>
                <p className="font-medium text-dark dark:text-white">
                  {new Date(item.processedAt)
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

              <TableCell>{item.statusName}</TableCell>

              <TableCell>{item.typeName || "Неизвестный тип"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
