import apiClient from "./axiosInstance";
import { playersApi } from "@/api/playersApi";
import { GameSettings } from "@/components/types";
import {
  filterTransactionsByBannedIds,
  loadRawTransactionsList,
  recalculateStatisticsExcludingBanned,
  resolveBannedPlayerIdsFromData,
} from "@/lib/exclude-banned";
import type { AppStatistics, StatisticsTimeline } from "@/lib/statistics-types";

/** Period of the statistics request */
type StatisticsParams = {
  dateFrom: string;
  dateTill: string;
};

/** Maps the statistics response to AppStatistics, accepting camelCase and PascalCase */
function normalizeStatistics(data: Record<string, unknown>): AppStatistics {
  return {
    usersTotal: Number(data.usersTotal ?? data.UsersTotal ?? 0),
    depositsTotal: Number(data.depositsTotal ?? data.DepositsTotal ?? 0),
    withdrawalsTotal: Number(
      data.withdrawalsTotal ?? data.WithdrawalsTotal ?? 0,
    ),
    incomeTotal: Number(data.incomeTotal ?? data.IncomeTotal ?? 0),
    balancesTotal:
      data.balancesTotal !== undefined
        ? Number(data.balancesTotal)
        : data.BalancesTotal !== undefined
          ? Number(data.BalancesTotal)
          : null,
    pendingWithdrawalsTotal: Number(
      data.pendingWithdrawalsTotal ?? data.PendingWithdrawalsTotal ?? 0,
    ),
  };
}

/** Maps a single timeline point of the response, accepting camelCase and PascalCase */
function normalizeTimelinePoint(
  point: Record<string, unknown>,
): StatisticsTimeline["points"][number] {
  return {
    date: String(point.date ?? point.Date ?? ""),
    usersCount: Number(point.usersCount ?? point.UsersCount ?? 0),
    depositsAmount: Number(point.depositsAmount ?? point.DepositsAmount ?? 0),
    withdrawalsAmount: Number(
      point.withdrawalsAmount ?? point.WithdrawalsAmount ?? 0,
    ),
    incomeAmount: Number(point.incomeAmount ?? point.IncomeAmount ?? 0),
  };
}

/** Maps the timeline response to StatisticsTimeline */
function normalizeTimeline(data: Record<string, unknown>): StatisticsTimeline {
  const rawPoints = (data.points ?? data.Points ?? []) as Record<
    string,
    unknown
  >[];

  return {
    dateFrom: String(data.dateFrom ?? data.DateFrom ?? ""),
    dateTill: String(data.dateTill ?? data.DateTill ?? ""),
    bucket: String(data.bucket ?? data.Bucket ?? "day"),
    points: rawPoints.map(normalizeTimelinePoint),
  };
}

/** Loads the active players and the transactions and works out which players are banned */
async function loadBannedAwareData() {
  const [activePlayers, rawTransactions] = await Promise.all([
    playersApi.getPlayersList(),
    loadRawTransactionsList(),
  ]);

  const bannedIds = resolveBannedPlayerIdsFromData({
    activePlayers,
    rawTransactions,
  });

  const transactions = filterTransactionsByBannedIds(
    rawTransactions,
    bannedIds,
  );

  return { activePlayers, transactions, bannedIds };
}

/** Recalculates the statistics without banned players when there are any */
async function applyBannedExclusion(
  stats: AppStatistics,
  params?: StatisticsParams,
): Promise<AppStatistics> {
  const { activePlayers, transactions, bannedIds } =
    await loadBannedAwareData();

  if (bannedIds.size === 0) {
    return stats;
  }

  const recalculated = recalculateStatisticsExcludingBanned(
    transactions,
    activePlayers,
    params,
  );

  return {
    ...stats,
    usersTotal: recalculated.usersTotal,
    depositsTotal: recalculated.depositsTotal,
    withdrawalsTotal: recalculated.withdrawalsTotal,
    incomeTotal: recalculated.incomeTotal,
    balancesTotal:
      recalculated.balancesTotal !== undefined
        ? recalculated.balancesTotal
        : stats.balancesTotal,
    pendingWithdrawalsTotal:
      recalculated.pendingWithdrawalsTotal !== undefined
        ? recalculated.pendingWithdrawalsTotal
        : stats.pendingWithdrawalsTotal,
  };
}

/** API calls for the statistics, the game settings and the application balance */
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
      return response.data;
    } catch (error) {
      console.error("Failed to update the threshold:", error);
      throw error;
    }
  },
  getStatistics: async (params?: StatisticsParams): Promise<AppStatistics> => {
    const response = await apiClient.get("/Admin/get-statistics", { params });
    const stats = normalizeStatistics(response.data);
    return applyBannedExclusion(stats, params);
  },
  getStatisticsTimeline: async (
    params: StatisticsParams,
  ): Promise<StatisticsTimeline> => {
    const response = await apiClient.get("/Admin/get-statistics-timeline", {
      params,
    });
    return normalizeTimeline(response.data);
  },
  getAppBalance: async () => {
    const response = await apiClient.get("/Admin/get-app-balance");
    return response.data;
  },
};
