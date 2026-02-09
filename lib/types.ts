export interface Position {
  marketId: string
  question: string
  strategy: string
  action: string
  size: number
  entryPrice: number
  currentPrice?: number
  edge: number
  confidence: number
  timestamp: string
  currentPnL?: number
  currentPnLPct?: number
}

export interface ClosedPosition extends Position {
  exitTimestamp: string
  exitPrice: number
  realizedPnL: number
  exitReason: string
}

export interface TradingData {
  positions: Position[]
  closedPositions: ClosedPosition[]
  realizedPnL: number
  cycleCount: number
}

export interface Stats {
  realizedPnL: number
  unrealizedPnL: number
  winRate: number
  winningTrades: number
  losingTrades: number
  totalTrades: number
}
