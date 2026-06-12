import apiClient from "./axiosInstance";
import { playersApi } from "@/api/playersApi";
import {
  filterTransactionsByBannedIds,
  loadRawTransactionsList,
  resolveBannedPlayerIdsFromData,
} from "@/lib/exclude-banned";
import type { PlayerTransactions } from "@/components/types";

async function loadBannedAwareTransactions(): Promise<PlayerTransactions[]> {
  const [activePlayers, rawTransactions] = await Promise.all([
    playersApi.getPlayersList(),
    loadRawTransactionsList(),
  ]);

  const bannedIds = resolveBannedPlayerIdsFromData({
    activePlayers,
    rawTransactions,
  });

  return filterTransactionsByBannedIds(rawTransactions, bannedIds);
}

export const transactionsApi = {
  getTransactionsList: async (): Promise<PlayerTransactions[]> => {
    try {
      return await loadBannedAwareTransactions();
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
