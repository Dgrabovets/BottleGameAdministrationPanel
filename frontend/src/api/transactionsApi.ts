import apiClient from "./axiosInstance"; // Импортируем apiClient

export const transactionsApi = {
  getTransactionsList: async () => {
    try {
      const response = await apiClient.get("/Balance/get-all-transactions");
      console.log("DEBUG API RESPONSE:", response.data);
      return response.data;
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
