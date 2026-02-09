import type { TradingData, Position, ClosedPosition, Stats } from './types'

// Mock data based on the trading data format
export async function fetchTradingData(): Promise<TradingData> {
  // In production, this would fetch from:
  // - ../polymarket-agents-official/data/autonomous_trader_state.json
  // - Or an API endpoint
  
  // For now, return mock data that matches the format
  return {
    positions: [
      {
        marketId: '0x1',
        question: 'Will Trump deport 250,000-500,000 people?',
        strategy: 'NO_FARMING',
        action: 'BUY_NO',
        size: 71,
        entryPrice: 0.1125,
        currentPrice: 0.1245,
        edge: 48.1,
        confidence: 80,
        timestamp: '2026-02-09T14:00:00',
        currentPnL: 7.55,
        currentPnLPct: 10.67
      },
      {
        marketId: '0x2',
        question: 'Will Elon and DOGE cut less than $50b?',
        strategy: 'NO_FARMING',
        action: 'BUY_NO',
        size: 71,
        entryPrice: 0.0220,
        currentPrice: 0.0225,
        edge: 52.6,
        confidence: 80,
        timestamp: '2026-02-09T14:05:00',
        currentPnL: 1.60,
        currentPnLPct: 2.27
      },
      {
        marketId: '0x3',
        question: 'Will Rob Jetten become PM?',
        strategy: 'NO_FARMING',
        action: 'BUY_NO',
        size: 72,
        entryPrice: 0.0065,
        currentPrice: 0.0065,
        edge: 63.8,
        confidence: 80,
        timestamp: '2026-02-09T14:10:00',
        currentPnL: 0,
        currentPnLPct: 0
      },
      {
        marketId: '0x4',
        question: 'Will Cardi B perform at Super Bowl?',
        strategy: 'NO_FARMING',
        action: 'BUY_NO',
        size: 72,
        entryPrice: 0.0015,
        currentPrice: 0.0015,
        edge: 45.2,
        confidence: 75,
        timestamp: '2026-02-09T14:15:00',
        currentPnL: 0,
        currentPnLPct: 0
      },
      {
        marketId: '0x5',
        question: 'Will US collect less than $100b revenue?',
        strategy: 'NO_FARMING',
        action: 'BUY_NO',
        size: 71,
        entryPrice: 0.1530,
        currentPrice: 0.1505,
        edge: 37.9,
        confidence: 80,
        timestamp: '2026-02-09T14:20:00',
        currentPnL: -1.16,
        currentPnLPct: -1.63
      }
    ],
    closedPositions: [
      {
        marketId: '0x10',
        question: 'Rob Jetten PM - Round 1',
        strategy: 'NO_FARMING',
        action: 'BUY_NO',
        size: 100,
        entryPrice: 0.0125,
        edge: 63.8,
        confidence: 80,
        timestamp: '2026-02-09T10:00:00',
        exitTimestamp: '2026-02-09T12:00:00',
        exitPrice: 0.0285,
        realizedPnL: 16.00,
        exitReason: 'PROFIT_TARGET'
      },
      {
        marketId: '0x11',
        question: 'Cardi B Super Bowl - Round 1',
        strategy: 'NO_FARMING',
        action: 'BUY_NO',
        size: 68,
        entryPrice: 0.015,
        edge: 45.2,
        confidence: 75,
        timestamp: '2026-02-09T10:30:00',
        exitTimestamp: '2026-02-09T13:00:00',
        exitPrice: 0.0815,
        realizedPnL: 45.37,
        exitReason: 'PROFIT_TARGET'
      },
      {
        marketId: '0x12',
        question: 'Elon/DOGE - Round 1',
        strategy: 'NO_FARMING',
        action: 'BUY_NO',
        size: 69,
        entryPrice: 0.0235,
        edge: 52.6,
        confidence: 80,
        timestamp: '2026-02-09T11:00:00',
        exitTimestamp: '2026-02-09T12:30:00',
        exitPrice: 0.0397,
        realizedPnL: 11.18,
        exitReason: 'PROFIT_TARGET'
      },
      {
        marketId: '0x13',
        question: 'Cardi B Super Bowl - Round 2',
        strategy: 'NO_FARMING',
        action: 'BUY_NO',
        size: 72,
        entryPrice: 0.018,
        edge: 45.2,
        confidence: 75,
        timestamp: '2026-02-09T13:30:00',
        exitTimestamp: '2026-02-09T15:00:00',
        exitPrice: 0.0512,
        realizedPnL: 23.91,
        exitReason: 'PROFIT_TARGET'
      },
      {
        marketId: '0x14',
        question: 'Cardi B Super Bowl - Round 3',
        strategy: 'NO_FARMING',
        action: 'BUY_NO',
        size: 90,
        entryPrice: 0.025,
        edge: 45.2,
        confidence: 75,
        timestamp: '2026-02-09T14:00:00',
        exitTimestamp: '2026-02-09T14:45:00',
        exitPrice: 0.015,
        realizedPnL: -36.00,
        exitReason: 'STOP_LOSS'
      }
    ],
    realizedPnL: 76.87,
    cycleCount: 191
  }
}

export function calculateStats(data: TradingData): Stats {
  const winningTrades = data.closedPositions.filter(p => (p.realizedPnL || 0) > 0).length
  const losingTrades = data.closedPositions.filter(p => (p.realizedPnL || 0) < 0).length
  const totalTrades = data.closedPositions.length
  
  const unrealizedPnL = data.positions.reduce((sum, p) => sum + (p.currentPnL || 0), 0)
  
  return {
    realizedPnL: data.realizedPnL,
    unrealizedPnL,
    winRate: totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0,
    winningTrades,
    losingTrades,
    totalTrades
  }
}
