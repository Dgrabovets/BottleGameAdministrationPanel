import type { PlayerTransactions } from "@/components/types";

function getPlayerId(item: PlayerTransactions): number {
  return item.player?.id ?? (item as { player?: { id?: number } }).player?.id ?? 0;
}

function getTransactionId(
  transaction: PlayerTransactions["transactions"][number],
): number {
  return transaction.id;
}

/** Убирает дубли игроков и транзакций из ответа API */
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
