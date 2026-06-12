import axios from "axios";
import apiClient from "./axiosInstance";
import { PlayerData } from "@/components/types";
import {
  filterNonBannedPlayersForDefaultList,
  filterPlayersBySearch,
  forgetBannedPlayerId,
  rememberBannedPlayerId,
} from "@/lib/exclude-banned";

export type PlayersListParams = {
  q?: string;
  telegramId?: number;
  name?: string;
};

function buildPlayersListUrl(params?: PlayersListParams): string {
  const searchParams = new URLSearchParams();

  if (params?.q) {
    searchParams.set("q", params.q);
  } else {
    if (params?.telegramId != null) {
      searchParams.set("telegramId", String(params.telegramId));
    }
    if (params?.name) {
      searchParams.set("name", params.name);
    }
  }

  const query = searchParams.toString();
  return query ? `/Player/get-all-players?${query}` : "/Player/get-all-players";
}

function normalizeSearchParams(params?: PlayersListParams): PlayersListParams | undefined {
  if (!params) return undefined;

  if (params.q?.trim()) {
    return { q: params.q.trim().replace(/^@+/, "") };
  }

  if (params.telegramId != null) {
    return { telegramId: params.telegramId };
  }

  if (params.name?.trim()) {
    return { name: params.name.trim().replace(/^@+/, "") };
  }

  return undefined;
}

export const playersApi = {
  getPlayersList: async (
    params?: PlayersListParams,
  ): Promise<PlayerData[]> => {
    const normalized = normalizeSearchParams(params);

    try {
      const response = await apiClient.get<PlayerData[]>(
        buildPlayersListUrl(normalized),
      );
      const players = response.data ?? [];

      let result = players;

      if (normalized?.q) {
        result = filterPlayersBySearch(players, normalized.q);
      } else if (normalized?.telegramId != null) {
        result = players.filter(
          (player) => player.player.telegramId === normalized.telegramId,
        );
      } else if (normalized?.name) {
        result = filterPlayersBySearch(players, normalized.name);
      }

      return filterNonBannedPlayersForDefaultList(result, normalized != null);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return normalized ? [] : [];
      }
      throw error;
    }
  },
  banPlayer: async (playerId: number, banReason: string) => {
    const response = await apiClient.post("/Player/ban-player", {
      playerId,
      banReason,
    });
    rememberBannedPlayerId(playerId);
    return response.data;
  },
  unbanPlayer: async (playerId: number) => {
    const response = await apiClient.post(
      `/Player/unban-player/${playerId}`,
    );
    forgetBannedPlayerId(playerId);
    return response.data;
  },
  getPlayersTop100: async (): Promise<PlayerData[]> => {
    const response = await apiClient.get<PlayerData[]>(
      "/Player/get-top100-players",
    );
    return filterNonBannedPlayersForDefaultList(response.data ?? [], false);
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
