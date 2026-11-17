import apiClient from "./axiosInstance";
import type { PlayerTransactions } from "@/components/types";
import { readTotalCount, type Page } from "@/lib/paging";

/** Query parameters of the transactions list */
export type TransactionsListParams = {
  /** Transaction type id, all types when omitted */
  typeId?: number;
  page: number;
  pageSize: number;
};

/** API calls for transactions */
export const transactionsApi = {
  /** Loads one page of transactions, newest first, grouped by player. Banned players are left out by the API */
  getTransactionsList: async (
    params: TransactionsListParams,
  ): Promise<Page<PlayerTransactions>> => {
    try {
      const response = await apiClient.get<PlayerTransactions[]>(
        "/Balance/get-all-transactions",
        { params },
      );
      const items = response.data ?? [];
      return { items, total: readTotalCount(response.headers, items.length) };
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
