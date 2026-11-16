import type { PlayerTransactions } from "@/components/types";

/** Ids of the transaction types */
export const TRANSACTION_TYPE = {
  deposit: 1,
  withdrawal: 2,
} as const;

/** Ids of the transaction statuses */
export const TRANSACTION_STATUS = {
  pending: 1,
  approved: 2,
  rejected: 3,
} as const;

/** English labels of the transaction types, keyed by id (the API returns the names from the database) */
const TYPE_LABEL: Record<number, string> = {
  [TRANSACTION_TYPE.deposit]: "Deposit",
  [TRANSACTION_TYPE.withdrawal]: "Withdrawal",
};

/** English labels of the transaction statuses, keyed by id */
const STATUS_LABEL: Record<number, string> = {
  [TRANSACTION_STATUS.pending]: "Pending",
  [TRANSACTION_STATUS.approved]: "Approved",
  [TRANSACTION_STATUS.rejected]: "Rejected",
};

/** Returns the label of a transaction type, or the name from the API when the id is unknown */
export function typeLabel(id: number, fallback: string): string {
  return TYPE_LABEL[id] ?? fallback;
}

/** Returns the label of a transaction status, or the name from the API when the id is unknown */
export function statusLabel(id: number, fallback: string): string {
  return STATUS_LABEL[id] ?? fallback;
}

/** Returns the id of the player of a transactions item, or 0 when it is missing */
function getPlayerId(item: PlayerTransactions): number {
  return (
    item.player?.id ?? (item as { player?: { id?: number } }).player?.id ?? 0
  );
}

/** Returns the id of a transaction */
function getTransactionId(
  transaction: PlayerTransactions["transactions"][number],
): number {
  return transaction.id;
}

/** Removes duplicate players and transactions from the API response */
export function dedupeTransactionsList(
  data: PlayerTransactions[],
): PlayerTransactions[] {
  const byPlayer = new Map<number, PlayerTransactions>();

  for (const item of data) {
    const playerId = getPlayerId(item);
    if (!playerId) continue;

    const existing = byPlayer.get(playerId);
    if (!existing) {
      byPlayer.set(playerId, {
        ...item,
        transactions: dedupeTransactions(item.transactions),
      });
      continue;
    }

    const knownIds = new Set(
      existing.transactions.map((transaction) => getTransactionId(transaction)),
    );

    for (const transaction of item.transactions) {
      const id = getTransactionId(transaction);
      if (!knownIds.has(id)) {
        existing.transactions.push(transaction);
        knownIds.add(id);
      }
    }
  }

  return Array.from(byPlayer.values());
}

/** Removes repeated transactions, keeping the first of each id */
function dedupeTransactions(
  transactions: PlayerTransactions["transactions"],
): PlayerTransactions["transactions"] {
  const seen = new Set<number>();
  return transactions.filter((transaction) => {
    const id = getTransactionId(transaction);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}
