"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { PreviewIcon, ConfirmIcon, CancelIcon } from "../icons";
import { useEffect, useState } from "react";
import { transactionsApi } from "@/api/transactionsApi";
import { PlayerTransactions } from "@/components/types";

export function Withdraws() {
  const [data, setData] = useState<PlayerTransactions[]>([]);

  useEffect(() => {
    const fetchWithdraws = async () => {
      try {
        const response = await transactionsApi.getTransactionsList();
        setData(response);
      } catch (err) {
        console.error(err);
      } finally {
      }
    };

    fetchWithdraws();
  }, []);

  if (!data) {
    return <div></div>;
  }

  const formattedData = data.flatMap((playerData) =>
    playerData.transactions
      .filter((transaction) => transaction.typeName === "Вывод") // Фильтруем только "Вывод"
      .map((transaction) => ({
        playerName: playerData.player.name,
        playerId: playerData.player.id,
        playerAvatar: playerData.player.avatarUrl,
        transactionId: transaction.id,
        amount: transaction.amount,
        status: transaction.statusName,
        type: transaction.typeName,
        createdAt: transaction.createdAt,
        processedAt: transaction.processedAt,
      })),
  );

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
          Запросы на вывод
        </h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
            <TableHead className="min-w-[155px] xl:pl-7.5">
              Пользователь
            </TableHead>
            <TableHead className="min-w-[155px] xl:pl-7.5">Сумма</TableHead>
            <TableHead>Дата запроса</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Операция</TableHead>
            <TableHead className="text-right xl:pr-7.5">Действия</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {formattedData.map((item) => (
            <TableRow
              key={item.playerId}
              className="border-[#eee] dark:border-dark-3"
            >
              <TableCell className="flex min-w-fit items-center gap-3">
                <Image
                  src={
                    isValidUrl(item?.playerAvatar)
                      ? item?.playerAvatar
                      : "/images/user/download.png"
                  }
                  className="w-15 rounded-full object-cover"
                  width={50}
                  height={50}
                  alt={"Player Avatar" + item.playerName}
                  role="presentation"
                />
                <h5 className="font-medium text-dark dark:text-white">
                  {item.playerName}
                </h5>
              </TableCell>

              <TableCell className="min-w-[155px] font-medium xl:pl-7.5">
                <h5 className="text-dark dark:text-white">${item.amount}</h5>
              </TableCell>

              <TableCell>
                <p className="font-medium text-dark dark:text-white">
                  {new Date(item.createdAt)
                    .toLocaleDateString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                    .replace(/\./g, "-")}
                </p>
              </TableCell>

              <TableCell>
                <div
                  className={cn(
                    "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium",
                    {
                      "bg-[#219653]/[0.08] text-[#219653]":
                        item.status === "Оплачено",
                      "bg-[#D34053]/[0.08] text-[#D34053]":
                        item.status === "Отклонено",
                      "bg-[#FFA70B]/[0.08] text-[#FFA70B]":
                        item.status === "Ожидает",
                    },
                  )}
                >
                  {item.status}
                </div>
              </TableCell>

              <TableCell>{item.type}</TableCell>

              <TableCell className="xl:pr-7.5">
                <div className="flex items-center justify-end gap-x-3.5">
                  <button className="hover:text-[#D34053]">
                    <span className="sr-only">Отклонить</span>
                    <CancelIcon />
                  </button>

                  <button className="hover:text-[#219653]">
                    <span className="sr-only">Подтвердить</span>
                    <ConfirmIcon />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
