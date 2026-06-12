import apiClient from "./axiosInstance";
import { dedupeTransactionsList } from "@/lib/transactions";
import type { PlayerTransactions } from "@/components/types";

export const transactionsApi = {
  getTransactionsList: async (): Promise<PlayerTransactions[]> => {
    try {
      const response = await apiClient.get<PlayerTransactions[]>(
        "/Balance/get-all-transactions",
      );
      return dedupeTransactionsList(response.data ?? []);
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
      console.log("DEBUG UPDATE RESPONSE:", response.data);
      return response.data;
    } catch (error) {
      console.error("Ошибка при обновлении статуса транзакции:", error);
      throw error;
    }
  },
};
