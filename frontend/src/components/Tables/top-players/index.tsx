"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { getPlayerAvatarUrl } from "@/lib/player-avatar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { playersApi } from "@/api/playersApi";
import { PlayerData } from "@/components/types";

export function TopPlayers() {
  const [data, setData] = useState<PlayerData[]>([]);

  useEffect(() => {
    const fetchTopPlayers = async () => {
      try {
        const response = await playersApi.getPlayersTop100();
        setData(response);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTopPlayers();
  }, []);

  if (!data) {
    return <div></div>;
  }

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          Топ 100
        </h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead>Топ</TableHead>
            <TableHead className="min-w-[120px] pl-5 sm:pl-6 xl:pl-7.5">
              Пользователь
            </TableHead>
            {/* <TableHead>Почта</TableHead> */}
            <TableHead>Баланс</TableHead>
            <TableHead>Победы</TableHead>
            <TableHead>Дата регистрации</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((player, index: number) => (
            <TableRow
              className="text-base font-medium text-dark dark:text-white"
              key={player.player.id}
              style={{ cursor: "pointer" }}
            >
              <TableCell>#{index + 1}</TableCell>

              <TableCell className="flex min-w-fit items-center gap-3">
                <Link
                  href={`/player/${player.player.id}`}
                  key={player.player.id}
                  passHref
                  className="flex min-w-fit items-center gap-3"
                >
                  <PlayerAvatar
                    src={getPlayerAvatarUrl(player.player)}
                    className="w-15"
                    width={50}
                    height={50}
                    alt={"Player Avatar" + player.player.name}
                  />
                  <div>{player.player.name}</div>
                </Link>
              </TableCell>

              {/* <TableCell>{player.email}</TableCell> */}

              <TableCell>{player.balance} ₽</TableCell>

              <TableCell>{player.player.winRate}</TableCell>

              <TableCell>
                {new Date(player.player.registeredInAppAt)
                  .toLocaleString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  .replace(/\//g, "-")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
