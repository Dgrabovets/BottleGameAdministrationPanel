"use client";
import { playersApi } from "@/api/playersApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { PlayerData } from "@/components/types";

export function Players() {
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await playersApi.getPlayersList();
        console.log(response);
        setPlayers(response);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        <h2 className="text-2xl font-bold text-dark dark:text-white">Игроки</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
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
          {players.map((player) => (
            <TableRow
              className="text-base font-medium text-dark dark:text-white"
              key={player.player.id}
              style={{ cursor: "pointer" }}
            >
              <TableCell className="flex min-w-fit items-center gap-3">
                <Link
                  href={`/player/${player.player.id}`}
                  key={player.player.id}
                  passHref
                  className="flex min-w-fit items-center gap-3"
                >
                  <Image
                    src={
                      isValidUrl(player.player.avatarUrl)
                        ? player.player.avatarUrl
                        : "/images/user/download.png"
                    }
                    className="w-15 rounded-full object-cover"
                    width={50}
                    height={50}
                    alt={"Player Avatar" + player.player.name}
                    role="presentation"
                  />
                  <div>{player.player.name}</div>
                </Link>
              </TableCell>

              {/* <TableCell>{player.email}</TableCell> */}

              <TableCell>${player.balance}</TableCell>

              <TableCell>{player.player.winRate?.toFixed(2)}%</TableCell>

              <TableCell>
                {new Date(player.player.registeredInAppAt)
                  .toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                  .replace(/\./g, "-")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
