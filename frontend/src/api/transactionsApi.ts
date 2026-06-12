import apiClient from "./axiosInstance";
import { dedupeTransactionsList } from "@/lib/transactions";
import {
  fetchActivelyBannedPlayerIds,
  filterTransactionsByBannedIds,
} from "@/lib/exclude-banned";
import { playersApi } from "@/api/playersApi";
import type { PlayerTransactions } from "@/components/types";

async function loadTransactionsWithoutBanned(): Promise<PlayerTransactions[]> {
  const response = await apiClient.get<PlayerTransactions[]>(
    "/Balance/get-all-transactions",
  );
  const deduped = dedupeTransactionsList(response.data ?? []);
  const bannedIds = await fetchActivelyBannedPlayerIds(() =>
    playersApi.getActivelyBannedPlayerIds(),
  );
  return filterTransactionsByBannedIds(deduped, bannedIds);
}

export const transactionsApi = {
  getTransactionsList: async (): Promise<PlayerTransactions[]> => {
    try {
      return await loadTransactionsWithoutBanned();
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
      throw error;
    }
  },

  updateTransactionStatus: async (
    transactionId: number,
    transactionStatusId: number,
  ) => {
    try {
      const response = await apiClient.post(
        `/Balance/update-transaction-status/${transactionId}`,
        {
          transactionStatusId,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Ошибка при обновлении статуса транзакции:", error);
      throw error;
    }
  },
};
