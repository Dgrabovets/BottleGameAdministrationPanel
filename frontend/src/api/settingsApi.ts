import apiClient from "./axiosInstance"; // Импортируем apiClient
import { GameSettings } from "@/components/types";

export const settingsApi = {
  getSettingsList: async () => {
    const response = await apiClient.get<GameSettings>(
      "/GameParams/get-game-params",
    );
    return response.data;
  },
  editSettings: async (data: GameSettings): Promise<GameSettings> => {
    const response = await apiClient.post<GameSettings>(
      "/GameParams/update-game-params",
      data,
    );
    return response.data;
  },
  updateThreshold: async (lowerThreshold: number) => {
    try {
      const response = await apiClient.post("/admin/update-threshold", {
        LowerThreshold: lowerThreshold,
      });
      console.log("DEBUG THRESHOLD RESPONSE:", response.data);
      return response.data;
    } catch (error) {
      console.error("Ошибка при обновлении порога:", error);
      throw error;
    }
  },
  getStatistics: async () => {
    const response = await apiClient.get("/Admin/get-statistics");
    return response.data;
  },
  getAppBalance: async () => {
    const response = await apiClient.get("/Admin/get-app-balance");
    return response.data;
  },
};
