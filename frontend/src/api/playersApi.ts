import apiClient from "./axiosInstance"; // Импортируем apiClient
import { PlayerData } from "@/components/types";

export const playersApi = {
  getPlayersList: async (): Promise<PlayerData[]> => {
    const response = await apiClient.get<PlayerData[]>(
      "/Player/get-all-players",
    );
    return response.data;
  },
  getPlayersTop100: async (): Promise<PlayerData[]> => {
    const response = await apiClient.get<PlayerData[]>(
      "/Player/get-top100-players",
    );
    return response.data;
  },
  getPlayerDetails: async (playerId: Number): Promise<PlayerData> => {
    const response = await apiClient.get<PlayerData>(
      `/Player/get-player/${playerId}`,
    );
    return response.data;
  },
  getPlayerTransactions: async (playerId: Number): Promise<PlayerData> => {
    const response = await apiClient.get<PlayerData>(
      `/Balance/get-player-transactions/${playerId}`,
    );
    return response.data;
  },
  editPlayer: async (
    playerId: Number,
    name: String,
    avatarUrl: String,
    winChance: Number,
  ) => {
    const response = await apiClient.post(`/Player/edit-player/${playerId}`, {
      name,
      avatarUrl,
      winChance,
    });

    return response.data;
  },
  registerModerator: async (login: string, password: string) => {
    const response = await apiClient.post("/Admin/moderator-register", {
      login,
      password,
    });

    return response.data;
  },
  getModerators: async () => {
    const response = await apiClient.get("/Admin/get-moderators");
    return response.data;
  },
  deleteModerator: async (moderatorId: number) => {
    const response = await apiClient.delete(
      `/Admin/delete-moderator/${moderatorId}`,
    );
    return response.data;
  },
};
