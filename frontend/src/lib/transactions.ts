/** Ids of the transaction types */
export const TRANSACTION_TYPE = {
  deposit: 1,
  withdrawal: 2,
} as const;

/** Ids of the transaction statuses */
export const TRANSACTION_STATUS = {
  pending: 1,
  approved: 2,
  rejected: 3,
} as const;

/** English labels of the transaction types, keyed by id (the API returns the names from the database) */
const TYPE_LABEL: Record<number, string> = {
  [TRANSACTION_TYPE.deposit]: "Deposit",
  [TRANSACTION_TYPE.withdrawal]: "Withdrawal",
};

/** English labels of the transaction statuses, keyed by id */
const STATUS_LABEL: Record<number, string> = {
  [TRANSACTION_STATUS.pending]: "Pending",
  [TRANSACTION_STATUS.approved]: "Approved",
  [TRANSACTION_STATUS.rejected]: "Rejected",
};

/** Returns the label of a transaction type, or the name from the API when the id is unknown */
export function typeLabel(id: number, fallback: string): string {
  return TYPE_LABEL[id] ?? fallback;
}

/** Returns the label of a transaction status, or the name from the API when the id is unknown */
export function statusLabel(id: number, fallback: string): string {
  return STATUS_LABEL[id] ?? fallback;
}
