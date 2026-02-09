import type { TradingData, Position, ClosedPosition, Stats } from './types'

// Fetch real trading data from the API
export async function fetchTradingData(): Promise<TradingData> {
  try {
    const response = await fetch('/api/data')
    if (!response.ok) {
      throw new Error('Failed to fetch trading data')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching trading data:', error)
    // Return empty data as fallback
    return {
      positions: [],
      closedPositions: [],
      realizedPnL: 0,
      cycleCount: 0,
    }
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
