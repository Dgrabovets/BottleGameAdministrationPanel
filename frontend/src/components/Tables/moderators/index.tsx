"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { playersApi } from "@/api/playersApi";

interface Moderator {
  id: number;
  login: string;
  createdAt: string;
  role: number;
}

export function ModeratorsTable() {
  const [moderators, setModerators] = useState<Moderator[]>([]);

  useEffect(() => {
    const fetchModerators = async () => {
      try {
        const data = await playersApi.getModerators();
        setModerators(data);
      } catch (error) {
        console.error("Ошибка при получении модераторов", error);
      }
    };

    fetchModerators();
  }, []);

  const handleDeleteModerator = async (moderatorId: number) => {
    try {
      await playersApi.deleteModerator(moderatorId);
      // Обнови список после удаления
      setModerators((prev) => prev.filter((mod) => mod.id !== moderatorId));
    } catch (error) {
      console.error("Ошибка при удалении модератора:", error);
    }
  };

  if (!moderators) {
    return <div></div>;
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  return (
    <Table className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <TableHeader>
        <TableRow className="bg-[#F7F9FC] dark:bg-dark-2">
          <TableHead>Пользователь</TableHead>
          <TableHead>Дата регистрации</TableHead>
          <TableHead>Роль</TableHead>
          <TableHead className="text-right xl:pr-7.5">Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {moderators.map((moderator) => (
          <TableRow
            key={moderator.id}
            className="border-[#eee] dark:border-dark-3"
          >
            <TableCell className="min-w-fit font-medium text-dark dark:text-white">
              {moderator.login}
            </TableCell>

            <TableCell>
              <p className="font-medium text-dark dark:text-white">
                {new Date(moderator.createdAt)
                  .toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                  .replace(/\./g, "-")}
              </p>
            </TableCell>

            <TableCell>
              <div className="max-w-fit rounded-full bg-[#2196f3]/[0.08] px-3.5 py-1 text-sm font-medium text-[#2196f3]">
                {moderator.role === 0 ? "Модератор" : "Админ"}
              </div>
            </TableCell>

            <TableCell className="text-right xl:pr-7.5">
              <button
                className="text-sm text-red-500 hover:underline"
                onClick={() => handleDeleteModerator(moderator.id)}
              >
                Удалить
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
