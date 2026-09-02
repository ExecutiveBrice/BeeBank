export interface BalanceEntry {
  id: number;
  playerId: number;
  playerName: string;
  failureId: number;
  failureName: string;
  failureAmount: number;
  paid: boolean;
  createdAt: string;
}
