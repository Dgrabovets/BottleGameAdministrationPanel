import apiClient from "./axiosInstance";
import { playersApi } from "@/api/playersApi";
import {
  filterTransactionsByBannedIds,
  loadRawTransactionsList,
  resolveBannedPlayerIdsFromData,
} from "@/lib/exclude-banned";
import type { PlayerTransactions } from "@/components/types";

/** Loads all transactions without the ones of banned players */
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

/** API calls for transactions */
export const transactionsApi = {
  getTransactionsList: async (): Promise<PlayerTransactions[]> => {
    try {
      return await loadBannedAwareTransactions();
    } catch (error) {
      console.error("Failed to load the data:", error);
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
      console.error("Failed to update the transaction status:", error);
      throw error;
    }
  },
};
