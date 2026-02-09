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
  realizedPnLPct?: number
  exitReason: string
}

export interface TradingData {
  positions: Position[]
  closedPositions: ClosedPosition[]
  realizedPnL: number
  cycleCount: number
  lastRun?: string
}

export interface Stats {
  realizedPnL: number
  unrealizedPnL: number
  winRate: number
  winningTrades: number
  losingTrades: number
  totalTrades: number
}

// Raw data shape from autonomous_trader_state.json
export interface RawPosition {
  timestamp: string
  market_id: string
  question: string
  strategy: string
  action: string
  size: number
  entry_price: number
  edge: number
  confidence: number
  status: string
}

export interface RawClosedPosition extends RawPosition {
  exit_timestamp: string
  exit_reason: string
  exit_price: number
  realized_pnl: number
  realized_pnl_pct: number
}

export interface RawLastPrice {
  price: number
  pnl_pct: number
  timestamp: string
}

export interface RawTraderState {
  positions: RawPosition[]
  closed_positions: RawClosedPosition[]
  realized_pnl: number
  cycle_count: number
  last_prices: Record<string, RawLastPrice>
  last_run: string
}
