export type AppStatistics = {
  usersTotal: number;
  depositsTotal: number;
  withdrawalsTotal: number;
  incomeTotal: number;
  balancesTotal?: number | null;
  pendingWithdrawalsTotal?: number;
};

export type StatisticsTimelinePoint = {
  date: string;
  usersCount: number;
  depositsAmount: number;
  withdrawalsAmount: number;
  incomeAmount: number;
};

export type StatisticsTimeline = {
  dateFrom: string;
  dateTill: string;
  bucket: string;
  points: StatisticsTimelinePoint[];
};

export type DateRange = {
  from: Date;
  till: Date;
};
