import apiClient from "./axiosInstance"; // Импортируем apiClient

export const transactionsApi = {
  getTransactionsList: async () => {
    try {
      const response = await apiClient.get("/Balance/get-all-transactions");
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
      throw error;
    }
  },
};
