"use client";
import { playersApi, PlayersListParams } from "@/api/playersApi";
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
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { PlayerData } from "@/components/types";

const SEARCH_DEBOUNCE_MS = 400;

function buildSearchParams(query: string): PlayersListParams | undefined {
  const trimmed = query.trim().replace(/^@+/, "");
  if (!trimmed) return undefined;

  if (/^\d+$/.test(trimmed)) {
    return { telegramId: Number(trimmed) };
  }

  return { name: trimmed };
}

export function Players() {
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState<PlayersListParams | undefined>();
  const [banTarget, setBanTarget] = useState<PlayerData | null>(null);
  const [banReason, setBanReason] = useState("");
  const [banError, setBanError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const requestIdRef = useRef(0);

  const loadPlayers = useCallback(async (params?: PlayersListParams) => {
    const requestId = ++requestIdRef.current;
    setLoading(true);

    try {
      const response = await playersApi.getPlayersList(params);
      if (requestId !== requestIdRef.current) return;
      setPlayers(response);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      console.error(err);
      setPlayers([]);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const trimmed = searchQuery.trim();

    if (!trimmed) {
      setActiveSearch(undefined);
      loadPlayers();
      return;
    }

    const timer = window.setTimeout(() => {
      const params = buildSearchParams(searchQuery);
      setActiveSearch(params);
      loadPlayers(params);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [searchQuery, loadPlayers]);

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const closeBanModal = () => {
    setBanTarget(null);
    setBanReason("");
    setBanError(null);
  };

  const handleBanSubmit = async () => {
    if (!banTarget) return;

    const reason = banReason.trim();
    if (!reason) {
      setBanError("Укажите причину бана");
      return;
    }
    if (reason.length > 255) {
      setBanError("Причина не должна превышать 255 символов");
      return;
    }

    setActionLoadingId(banTarget.player.id);
    setBanError(null);
    try {
      await playersApi.banPlayer(banTarget.player.id, reason);
      closeBanModal();
      if (activeSearch) {
        setPlayers((prev) =>
          prev.map((p) =>
            p.player.id === banTarget.player.id
              ? { ...p, bannedAt: new Date().toISOString() }
              : p,
          ),
        );
      } else {
        setPlayers((prev) =>
          prev.filter((p) => p.player.id !== banTarget.player.id),
        );
      }
    } catch (err) {
      console.error(err);
      setBanError("Не удалось забанить игрока");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleUnban = async (player: PlayerData) => {
    setActionLoadingId(player.player.id);
    try {
      await playersApi.unbanPlayer(player.player.id);
      if (activeSearch) {
        setPlayers((prev) =>
          prev.map((p) =>
            p.player.id === player.player.id ? { ...p, bannedAt: null } : p,
          ),
        );
      } else {
        setPlayers((prev) =>
          prev.filter((p) => p.player.id !== player.player.id),
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-5 xl:px-8.5">
        <h2 className="text-2xl font-bold text-dark dark:text-white">Игроки</h2>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Telegram ID или ник"
              autoComplete="off"
              className="h-11 w-full rounded-lg border border-stroke bg-transparent px-4 pr-10 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
            />
            {loading && isSearching && (
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-dark-6">
                ...
              </span>
            )}
          </div>
          {isSearching && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="inline-flex h-11 shrink-0 select-none items-center justify-center rounded-lg border border-stroke px-4 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
            >
              Сбросить
            </button>
          )}
        </div>
      </div>

      {loading && !isSearching ? (
        <div className="px-6 py-8 text-center text-dark-6">Загрузка...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
              <TableHead className="min-w-[120px] pl-5 sm:pl-6 xl:pl-7.5">
                Пользователь
              </TableHead>
              <TableHead>Telegram ID</TableHead>
              <TableHead>Баланс</TableHead>
              <TableHead>Победы</TableHead>
              <TableHead>Дата регистрации</TableHead>
              <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">
                Действия
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading && isSearching ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-dark-6">
                  Поиск...
                </TableCell>
              </TableRow>
            ) : players.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-dark-6"
                >
                  {activeSearch ? "Игроки не найдены" : "Нет игроков"}
                </TableCell>
              </TableRow>
            ) : (
              players.map((player) => {
                const isBanned = player.bannedAt != null;
                const isBusy = actionLoadingId === player.player.id;

                return (
                  <TableRow
                    className="text-base font-medium text-dark dark:text-white"
                    key={player.player.id}
                  >
                    <TableCell className="flex min-w-fit items-center gap-3 pl-5 sm:pl-6 xl:pl-7.5">
                      <Link
                        href={`/player/${player.player.id}`}
                        className="flex min-w-fit items-center gap-3"
                      >
                        <PlayerAvatar
                          src={getPlayerAvatarUrl(player.player)}
                          className="w-15"
                          width={50}
                          height={50}
                          alt={"Player Avatar" + player.player.name}
                        />
                        <div className="flex items-center gap-2">
                          <span>{player.player.name}</span>
                          {isBanned && (
                            <span className="rounded-full bg-[#D34053]/[0.08] px-2.5 py-0.5 text-xs font-medium text-[#D34053]">
                              Забанен
                            </span>
                          )}
                        </div>
                      </Link>
                    </TableCell>

                    <TableCell>{player.player.telegramId}</TableCell>

                    <TableCell>{player.balance} ₽</TableCell>

                    <TableCell>
                      {player.player.winRate?.toFixed(2)}%
                    </TableCell>

                    <TableCell>
                      {new Date(player.player.registeredInAppAt)
                        .toLocaleDateString("ru-RU", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                        .replace(/\./g, "-")}
                    </TableCell>

                    <TableCell className="pr-5 text-right sm:pr-6 xl:pr-7.5">
                      {isBanned ? (
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleUnban(player)}
                          className={cn(
                            "inline-flex h-9 items-center justify-center rounded-lg border border-[#219653] px-4 text-sm font-medium text-[#219653] transition hover:bg-[#219653]/[0.08]",
                            isBusy && "cursor-not-allowed opacity-50",
                          )}
                        >
                          Разбанить
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => {
                            setBanTarget(player);
                            setBanReason("");
                            setBanError(null);
                          }}
                          className={cn(
                            "inline-flex h-9 items-center justify-center rounded-lg border border-[#D34053] px-4 text-sm font-medium text-[#D34053] transition hover:bg-[#D34053]/[0.08]",
                            isBusy && "cursor-not-allowed opacity-50",
                          )}
                        >
                          Забанить
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      )}

      {banTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            className="w-full max-w-md rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark"
            role="dialog"
            aria-labelledby="ban-dialog-title"
          >
            <h3
              id="ban-dialog-title"
              className="mb-1 text-lg font-bold text-dark dark:text-white"
            >
              Забанить игрока
            </h3>
            <p className="mb-4 text-sm text-dark-6">
              {banTarget.player.name} (ID {banTarget.player.telegramId})
            </p>

            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Причина бана
            </label>
            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              rows={3}
              maxLength={255}
              className="mb-2 w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
              placeholder="Опишите причину"
            />
            {banError && (
              <p className="mb-3 text-sm text-[#D34053]">{banError}</p>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeBanModal}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-stroke px-4 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:text-white"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={handleBanSubmit}
                disabled={actionLoadingId === banTarget.player.id}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-[#D34053] px-4 text-sm font-semibold text-white transition hover:bg-[#D34053]/90 disabled:opacity-50"
              >
                Забанить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
