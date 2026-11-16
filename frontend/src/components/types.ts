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

/** Short description of a player */
export interface ShortPlayer {
  id: number;
  telegramId: number;
  name: string;
  avatarUrl: string;
  registeredAt: string; // Could be replaced with Date if the date is parsed
  registeredInAppAt: string;
  winRate: number;
}

/** Ban of a player */
export interface Ban {
  playerId: number;
  player: string;
  bannedAt: string;
}

/** Balance of a player */
export interface Balance {
  playerId: number;
  player: string;
  amount: number;
}

/** Game round */
export interface GameRound {
  id: number;
  playerId: number;
  player: string;
  bet: number;
  isWin: boolean;
  finishedAt: string;
}

/** Referral link of a player */
export interface ReferalLink {
  playerId: number;
  player: string;
  link: string;
}

/** Invitation of one player by another */
export interface Invitation {
  playerIdInvitedBy: number;
  playerInvitedBy: string;
  playerIdInvited: number;
  playerInvited: string;
  invitedAt: string;
}

/** Transaction as stored in the database */
export interface Transaction {
  id: number;
  amount: number;
  status: number;
  type: number;
  createdAt: string;
  processedAt: string;
}

/** Status of a transaction */
export interface TransactionStatus {
  id: number;
  name: string;
  moneyTransaction: string;
}

/** Type of a transaction */
export interface TransactionType {
  id: number;
  name: string;
  moneyTransaction: string;
}

/** Game settings as returned by the API */
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

/** Transactions of a player */
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

/** Rounds of a player */
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

/** Round of a player */
export interface Round {
  id: number;
  bet: number;
  isWin: boolean;
  finishedAt: string; // format: "YYYY-MM-DDTHH:mm:ssZ"
}

/** Player invited by another player */
type InvitedPlayer = {
  id: number;
  telegramId: number;
  name: string;
  avatarUrl: string;
  registeredInAppAt: string;
  winRate: number;
};

/** Options of a player */
interface OptionData {
  winChance: number;
}

// get all players interface
export interface PlayerData {
  balance: number;
  bannedAt: string | null; // null if the player is not banned
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

/** Transactions of a player together with the player */
export interface PlayerTransactions {
  player: Player;
  transactions: Transaction[];
}
