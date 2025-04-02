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
    console.log(data, "settingssavedata");
    const response = await apiClient.post<GameSettings>( // используем PUT для обновления данных
      "/GameParams/update-game-params", // предполагаем, что эндпоинт для обновления данных
      data,
    );
    return response.data;
  },
};
