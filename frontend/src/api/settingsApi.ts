import apiClient from "./axiosInstance";
import { GameSettings } from "@/components/types";
import type {
  AppStatistics,
  StatisticsTimeline,
} from "@/lib/statistics-types";

type StatisticsParams = {
  dateFrom: string;
  dateTill: string;
};

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
  getStatistics: async (params?: StatisticsParams): Promise<AppStatistics> => {
    const response = await apiClient.get("/Admin/get-statistics", { params });
    return normalizeStatistics(response.data);
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
