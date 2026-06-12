import type { AppStatistics } from "@/lib/statistics-types";
import type { PlayerData, PlayerTransactions } from "@/components/types";

let bannedIdsCache: Set<number> | null = null;
let bannedIdsCacheAt = 0;
const BANNED_IDS_CACHE_MS = 15_000;

export function invalidateBannedPlayersCache(): void {
  bannedIdsCache = null;
  bannedIdsCacheAt = 0;
}

export async function fetchActivelyBannedPlayerIds(
  loader: () => Promise<number[]>,
): Promise<Set<number>> {
  const now = Date.now();
  if (bannedIdsCache && now - bannedIdsCacheAt < BANNED_IDS_CACHE_MS) {
    return bannedIdsCache;
  }

  try {
    const ids = await loader();
    bannedIdsCache = new Set(ids);
    bannedIdsCacheAt = now;
    return bannedIdsCache;
  } catch {
    return new Set();
  }
}

export function filterTransactionsByBannedIds(
  data: PlayerTransactions[],
  bannedIds: Set<number>,
): PlayerTransactions[] {
  if (bannedIds.size === 0) return data;
  return data.filter((item) => !bannedIds.has(item.player.id));
}

export function filterPlayersBySearch(
  players: PlayerData[],
  query: string,
): PlayerData[] {
  const trimmed = query.trim().replace(/^@+/, "");
  if (!trimmed) return players;

  if (/^\d+$/.test(trimmed)) {
    const telegramId = Number(trimmed);
    return players.filter((player) => player.player.telegramId === telegramId);
  }

  const normalized = trimmed.toLowerCase();
  return players.filter((player) =>
    player.player.name.toLowerCase().includes(normalized),
  );
}

function parseProcessedAt(value: string): Date | null {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isWithinRange(
  processedAt: string,
  dateFrom?: string,
  dateTill?: string,
): boolean {
  if (!dateFrom || !dateTill) return true;

  const processed = parseProcessedAt(processedAt);
  if (!processed) return false;

  const from = new Date(`${dateFrom}T00:00:00.000Z`);
  const till = new Date(`${dateTill}T23:59:59.999Z`);
  return processed >= from && processed <= till;
}

export function recalculateStatisticsExcludingBanned(
  transactions: PlayerTransactions[],
  players: PlayerData[],
  params?: { dateFrom: string; dateTill: string },
): Pick<
  AppStatistics,
  | "usersTotal"
  | "depositsTotal"
  | "withdrawalsTotal"
  | "incomeTotal"
  | "balancesTotal"
  | "pendingWithdrawalsTotal"
> {
  const approvedDeposits = transactions
    .flatMap((item) => item.transactions)
    .filter(
      (transaction) =>
        transaction.typeName === "Пополнение" &&
        transaction.statusName === "Одобрено" &&
        isWithinRange(transaction.processedAt, params?.dateFrom, params?.dateTill),
    )
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const approvedWithdrawals = transactions
    .flatMap((item) => item.transactions)
    .filter(
      (transaction) =>
        transaction.typeName === "Вывод" &&
        transaction.statusName === "Одобрено" &&
        isWithinRange(transaction.processedAt, params?.dateFrom, params?.dateTill),
    )
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const pendingWithdrawals = transactions
    .flatMap((item) => item.transactions)
    .filter(
      (transaction) =>
        transaction.typeName === "Вывод" && transaction.statusName === "Ожидание",
    )
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const usersTotal = params
    ? players.filter((player) => {
        const registered = parseProcessedAt(player.player.registeredInAppAt);
        if (!registered) return false;
        const from = new Date(`${params.dateFrom}T00:00:00.000Z`);
        const till = new Date(`${params.dateTill}T23:59:59.999Z`);
        return registered >= from && registered <= till;
      }).length
    : players.length;

  return {
    usersTotal,
    depositsTotal: approvedDeposits,
    withdrawalsTotal: approvedWithdrawals,
    incomeTotal: approvedDeposits - approvedWithdrawals,
    balancesTotal: params
      ? undefined
      : players.reduce((sum, player) => sum + player.balance, 0),
    pendingWithdrawalsTotal: params ? undefined : pendingWithdrawals,
  };
}
