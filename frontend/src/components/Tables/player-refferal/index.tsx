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

interface PlayerReferralProps {
  data: PlayerData;
}

export function PlayerRefferalTable({ data }: PlayerReferralProps) {
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
          Рефералы игрока
        </h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
            <TableHead className="min-w-[155px] xl:pl-7.5">
              Пользователь
            </TableHead>
            <TableHead>Telegram ID</TableHead>
            <TableHead>Дата регистрации</TableHead>
            <TableHead>Победы</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.playersInvited?.map((item) => (
            <TableRow
              key={item.id}
              className="border-[#eee] dark:border-dark-3"
            >
              <TableCell className="flex min-w-fit items-center gap-3">
                <Link
                  href={`/player/${item.id}`}
                  key={item?.id}
                  passHref
                  className="flex min-w-fit items-center gap-3"
                >
                  <Image
                    src={
                      isValidUrl(item?.avatarUrl)
                        ? data.player.avatarUrl
                        : "/images/user/download.png"
                    }
                    className="w-15 rounded-full object-cover"
                    width={50}
                    height={50}
                    alt={"Player Avatar" + item.name}
                    role="presentation"
                  />
                  <div>{item.name}</div>
                </Link>
              </TableCell>

              <TableCell className="min-w-[155px] font-medium xl:pl-7.5">
                <h5 className="text-dark dark:text-white">{item.telegramId}</h5>
              </TableCell>

              <TableCell>
                <p className="font-medium text-dark dark:text-white">
                  {new Date(item.registeredInAppAt)
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

              <TableCell>{item.winRate}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
