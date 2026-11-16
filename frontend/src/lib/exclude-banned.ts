import apiClient from "@/api/axiosInstance";
import {
  dedupeTransactionsList,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from "@/lib/transactions";
import type { AppStatistics } from "@/lib/statistics-types";
import type { PlayerData, PlayerTransactions } from "@/components/types";

/** Key of the local storage that keeps the ids of banned players */
const BANNED_IDS_STORAGE_KEY = "bottle_admin_banned_player_ids";

/** Reads the stored ids of banned players */
function readStoredBannedIds(): Set<number> {
  if (typeof window === "undefined") {
    return new Set();
  }

  try {
    const raw = sessionStorage.getItem(BANNED_IDS_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as number[];
    return new Set(parsed.filter((id) => Number.isInteger(id) && id > 0));
  } catch {
    return new Set();
  }
}

/** Stores the ids of banned players */
function writeStoredBannedIds(ids: Set<number>): void {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(BANNED_IDS_STORAGE_KEY, JSON.stringify([...ids]));
}

/** Remembers a player as banned */
export function rememberBannedPlayerId(playerId: number): void {
  const ids = readStoredBannedIds();
  ids.add(playerId);
  writeStoredBannedIds(ids);
}

/** Forgets a banned player after the unban */
export function forgetBannedPlayerId(playerId: number): void {
  const ids = readStoredBannedIds();
  ids.delete(playerId);
  writeStoredBannedIds(ids);
}

/** Loads all transactions without removing banned players */
export async function loadRawTransactionsList(): Promise<PlayerTransactions[]> {
  const response = await apiClient.get<PlayerTransactions[]>(
    "/Balance/get-all-transactions",
  );
  return dedupeTransactionsList(response.data ?? []);
}

/** Collects the ids of the players in the transactions */
function collectTransactionPlayerIds(
  transactions: PlayerTransactions[],
): Set<number> {
  const ids = new Set<number>();
  for (const item of transactions) {
    const playerId = item.player?.id;
    if (playerId) {
      ids.add(playerId);
    }
  }
  return ids;
}

/** Data needed to find the banned players */
export type ResolveBannedPlayerIdsOptions = {
  activePlayers: PlayerData[];
  rawTransactions: PlayerTransactions[];
};

/** Finds the banned players: the stored ones, the ones missing from the active list and the ones with a ban date */
export function resolveBannedPlayerIdsFromData(
  options: ResolveBannedPlayerIdsOptions,
): Set<number> {
  const banned = new Set<number>(readStoredBannedIds());

  const activeIds = new Set(
    options.activePlayers.map((player) => player.player.id),
  );

  for (const playerId of collectTransactionPlayerIds(options.rawTransactions)) {
    if (!activeIds.has(playerId)) {
      banned.add(playerId);
    }
  }

  for (const player of options.activePlayers) {
    if (player.bannedAt != null) {
      banned.add(player.player.id);
    }
  }

  return banned;
}

/** Removes the transactions of banned players */
export function filterTransactionsByBannedIds(
  data: PlayerTransactions[],
  bannedIds: Set<number>,
): PlayerTransactions[] {
  if (bannedIds.size === 0) return data;
  return data.filter((item) => !bannedIds.has(item.player.id));
}

/** Hides banned players from the default list, a search shows everyone */
export function filterNonBannedPlayersForDefaultList(
  players: PlayerData[],
  isSearch: boolean,
): PlayerData[] {
  if (isSearch) {
    return players;
  }

  const storedBanned = readStoredBannedIds();
  return players.filter(
    (player) => player.bannedAt == null && !storedBanned.has(player.player.id),
  );
}

/** Filters players by a Telegram id or by part of the name */
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

/** Parses a processing date, returns null when it is invalid */
function parseProcessedAt(value: string): Date | null {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Checks that a date falls inside the optional range */
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

/** Recalculates the statistics from the transactions, leaving banned players out */
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
        transaction.typeId === TRANSACTION_TYPE.deposit &&
        transaction.statusId === TRANSACTION_STATUS.approved &&
        isWithinRange(
          transaction.processedAt,
          params?.dateFrom,
          params?.dateTill,
        ),
    )
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const approvedWithdrawals = transactions
    .flatMap((item) => item.transactions)
    .filter(
      (transaction) =>
        transaction.typeId === TRANSACTION_TYPE.withdrawal &&
        transaction.statusId === TRANSACTION_STATUS.approved &&
        isWithinRange(
          transaction.processedAt,
          params?.dateFrom,
          params?.dateTill,
        ),
    )
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const pendingWithdrawals = transactions
    .flatMap((item) => item.transactions)
    .filter(
      (transaction) =>
        transaction.typeId === TRANSACTION_TYPE.withdrawal &&
        transaction.statusId === TRANSACTION_STATUS.pending,
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
