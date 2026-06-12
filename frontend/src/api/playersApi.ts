import axios from "axios";
import apiClient from "./axiosInstance";
import { PlayerData } from "@/components/types";

export type PlayersListParams = {
  telegramId?: number;
  name?: string;
};

function buildPlayersListUrl(params?: PlayersListParams): string {
  if (!params) {
    return "/Player/get-all-players";
  }

  const searchParams = new URLSearchParams();
  if (params.telegramId != null) {
    searchParams.set("telegramId", String(params.telegramId));
  }
  if (params.name) {
    searchParams.set("name", params.name);
  }

  const query = searchParams.toString();
  return query ? `/Player/get-all-players?${query}` : "/Player/get-all-players";
}

export const playersApi = {
  getPlayersList: async (
    params?: PlayersListParams,
  ): Promise<PlayerData[]> => {
    try {
      const response = await apiClient.get<PlayerData[]>(
        buildPlayersListUrl(params),
      );
      return response.data ?? [];
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return params ? [] : [];
      }
      throw error;
    }
  },
  banPlayer: async (playerId: number, banReason: string) => {
    const response = await apiClient.post("/Player/ban-player", {
      playerId,
      banReason,
    });
    return response.data;
  },
  unbanPlayer: async (playerId: number) => {
    const response = await apiClient.post(
      `/Player/unban-player/${playerId}`,
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

  /**
   * Обновление баланса игрока (только для админа).
   * Отправляет только поле balance, остальные поля null.
   */
  editPlayerBalance: async (playerId: number, balance: number) => {
    const response = await apiClient.post(
      `/Player/edit-player/${playerId}`,
      { balance },
    );
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
