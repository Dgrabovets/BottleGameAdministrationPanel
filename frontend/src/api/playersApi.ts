import axios from "axios";
import apiClient from "./axiosInstance";
import { PlayerData } from "@/components/types";
import { readTotalCount, type Page } from "@/lib/paging";

/** Query parameters of the players list */
export type PlayersListParams = {
  q?: string;
  telegramId?: number;
  name?: string;
  /** Page number from 1, the whole list when omitted */
  page?: number;
  pageSize?: number;
};

/** Builds the URL of the players list from the query parameters */
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

  if (params?.page != null) {
    searchParams.set("page", String(params.page));
  }
  if (params?.pageSize != null) {
    searchParams.set("pageSize", String(params.pageSize));
  }

  const query = searchParams.toString();
  return query ? `/Player/get-all-players?${query}` : "/Player/get-all-players";
}

/** Trims the search parameters, drops the empty ones and keeps the paging */
function normalizeSearchParams(params?: PlayersListParams): PlayersListParams {
  const paging = { page: params?.page, pageSize: params?.pageSize };

  if (params?.q?.trim()) {
    return { q: params.q.trim().replace(/^@+/, ""), ...paging };
  }

  if (params?.telegramId != null) {
    return { telegramId: params.telegramId, ...paging };
  }

  if (params?.name?.trim()) {
    return { name: params.name.trim().replace(/^@+/, ""), ...paging };
  }

  return paging;
}

/** API calls for players, bans and the player balance */
export const playersApi = {
  /** Loads the players, one page when page or pageSize is given. Without a search banned players are left out by the API */
  getPlayersList: async (
    params?: PlayersListParams,
  ): Promise<Page<PlayerData>> => {
    try {
      const response = await apiClient.get<PlayerData[]>(
        buildPlayersListUrl(normalizeSearchParams(params)),
      );
      const items = response.data ?? [];
      return { items, total: readTotalCount(response.headers, items.length) };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return { items: [], total: 0 };
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
    const response = await apiClient.post(`/Player/unban-player/${playerId}`);
    return response.data;
  },
  getPlayersTop100: async (): Promise<PlayerData[]> => {
    const response = await apiClient.get<PlayerData[]>(
      "/Player/get-top100-players",
    );
    return response.data ?? [];
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
   * Updates the player balance (admin only)
   * Sends only the balance field, the other fields are null
   */
  editPlayerBalance: async (playerId: number, balance: number) => {
    const response = await apiClient.post(`/Player/edit-player/${playerId}`, {
      balance,
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
