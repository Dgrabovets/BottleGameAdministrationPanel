// Interfaces related to Player
export interface Player {
  id: number;
  telegramId: number;
  name: string;
  avatarUrl: string;
  registeredInAppAt: string;
  registeredAt: string;
  winRate: number;
  ban: Ban | null;
  balance: Balance;
  gameRounds: GameRound[];
  referalLink: ReferalLink | null;
  invitedByMe: Invitation[];
  invitedMe: Invitation | null;
  moneyTransactions: Transaction[];
}

export interface ShortPlayer {
  id: number;
  telegramId: number;
  name: string;
  avatarUrl: string;
  registeredAt: string; // Можно заменить на Date, если будем парсить дату
  registeredInAppAt: string;
  winRate: number;
}

export interface Ban {
  playerId: number;
  player: string;
  bannedAt: string;
}

export interface Balance {
  playerId: number;
  player: string;
  amount: number;
}

export interface GameRound {
  id: number;
  playerId: number;
  player: string;
  bet: number;
  isWin: boolean;
  finishedAt: string;
}

export interface ReferalLink {
  playerId: number;
  player: string;
  link: string;
}

export interface Invitation {
  playerIdInvitedBy: number;
  playerInvitedBy: string;
  playerIdInvited: number;
  playerInvited: string;
  invitedAt: string;
}

export interface Transaction {
  id: number;
  amount: number;
  status: number;
  type: number;
  createdAt: string;
  processedAt: string;
}

export interface TransactionStatus {
  id: number;
  name: string;
  moneyTransaction: string;
}

export interface TransactionType {
  id: number;
  name: string;
  moneyTransaction: string;
}

export interface GameSettings {
  baseWinChance: number;
  minWinChance: number;
  maxWinChance: number;
  baseMultiplierProbability: number;

  chanceDecPerThrowMin: number;
  chanceDecPerThrowMax: number;
  chanceDecPerRotation: number;
  minRotationWinChance: number;

  minMultiplier: number;
  maxMultiplier: number;
  probabilityFor1_5: number;
  probabilityFor2: number;
  probabilityFor3: number;
  probabilityFor5: number;
  probabilityFor10: number;

  initialBalanceLoss: number;
  deviationChance: number;
  maxDeviationPercent: number;

  minGamesForBoost: number;
  winBoostChance: number;
  winBoostMultiplier: number;

  hardResetChance: number;
  controlGoal: number;

  reelSpeed: number;
  uprightThresholdForLine: number;
}

export interface TransactionsResponse {
  player: ShortPlayer;
  transactions: Transaction[];
}

// Interfaces related to rounds
export interface GameRound {
  id: number;
  bet: number;
  isWin: boolean;
  finishedAt: string;
}

export interface RoundsResponse {
  player: ShortPlayer;
  rounds: GameRound[];
}

// Interfaces related to player statistics
export interface StatisticsResponse {
  player: ShortPlayer;
  balance: number;
  roundsQty: number;
  winsQty: number;
  lossQty: number;
  winAmount: number;
  lossAmount: number;
}

export interface Round {
  id: number;
  bet: number;
  isWin: boolean;
  finishedAt: string; // формат: "YYYY-MM-DDTHH:mm:ssZ"
}

type InvitedPlayer = {
  id: number;
  telegramId: number;
  name: string;
  avatarUrl: string;
  registeredInAppAt: string;
  winRate: number;
};

interface OptionData {
  winChance: number;
}

// get all players interface
export interface PlayerData {
  balance: number;
  bannedAt: string | null; // null, если игрок не забанен
  player: Player;
  rounds?: Round[];
  transactions?: Transaction[];
  playersInvited?: InvitedPlayer[];
  options?: OptionData;
}

// Transactions
export interface Transaction {
  id: number;
  amount: number;
  statusId: number;
  statusName: string;
  typeId: number;
  typeName: string;
  createdAt: string; // ISO date string
  processedAt: string; // ISO date string
}

export interface PlayerTransactions {
  player: Player;
  transactions: Transaction[];
}
