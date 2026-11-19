/** Statistics of the application */
export type AppStatistics = {
  usersTotal: number;
  depositsTotal: number;
  withdrawalsTotal: number;
  incomeTotal: number;
  balancesTotal?: number | null;
  pendingWithdrawalsTotal?: number;
};

/** One point of the statistics timeline */
export type StatisticsTimelinePoint = {
  date: string;
  usersCount: number;
  depositsAmount: number;
  withdrawalsAmount: number;
  incomeAmount: number;
};

/** Statistics timeline for charts */
export type StatisticsTimeline = {
  dateFrom: string;
  dateTill: string;
  bucket: string;
  points: StatisticsTimelinePoint[];
};

/** Period selected in the date filter */
export type DateRange = {
  from: Date;
  till: Date;
};
