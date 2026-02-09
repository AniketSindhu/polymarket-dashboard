import { NextResponse } from 'next/server'
import { getTradingStateFromRedis, isRedisConfigured } from '@/lib/redis'
import type {
  TradingData,
  Position,
  ClosedPosition,
  RawPosition,
  RawClosedPosition,
} from '@/lib/types'

function mapPosition(raw: RawPosition, lastPrices: Record<string, any>): Position {
  const priceInfo = lastPrices?.[raw.market_id]
  const currentPrice = priceInfo?.price ?? raw.entry_price ?? 0
  const pnlPct = priceInfo?.pnl_pct ?? 0
  const currentPnL = (raw.size ?? 0) * pnlPct

  return {
    marketId: raw.market_id,
    question: raw.question || 'Unknown',
    strategy: raw.strategy || 'UNKNOWN',
    action: raw.action || 'UNKNOWN',
    size: raw.size ?? 0,
    entryPrice: raw.entry_price ?? 0,
    currentPrice,
    edge: raw.edge ?? 0,
    confidence: raw.confidence ?? 0,
    timestamp: raw.timestamp,
    currentPnL,
    currentPnLPct: pnlPct * 100,
  }
}

function mapClosedPosition(raw: RawClosedPosition): ClosedPosition {
  return {
    marketId: raw.market_id,
    question: raw.question || 'Unknown',
    strategy: raw.strategy || 'UNKNOWN',
    action: raw.action || 'UNKNOWN',
    size: raw.size ?? 0,
    entryPrice: raw.entry_price ?? 0,
    edge: raw.edge ?? 0,
    confidence: raw.confidence ?? 0,
    timestamp: raw.timestamp,
    exitTimestamp: raw.exit_timestamp,
    exitPrice: raw.exit_price ?? 0,
    realizedPnL: raw.realized_pnl ?? 0,
    realizedPnLPct: raw.realized_pnl_pct ?? 0,
    exitReason: raw.exit_reason || 'UNKNOWN',
  }
}

function emptyData(): TradingData {
  return {
    positions: [],
    closedPositions: [],
    realizedPnL: 0,
    cycleCount: 0,
  }
}

export async function GET() {
  // Try Redis only (filesystem won't work on Vercel)
  if (!isRedisConfigured()) {
    console.log('Redis not configured, returning empty data')
    return NextResponse.json({
      ...emptyData(),
      error: 'Redis not configured',
    })
  }

  try {
    console.log('Fetching from Redis...')
    const redisData = await getTradingStateFromRedis()
    
    if (!redisData) {
      console.log('No data in Redis')
      return NextResponse.json({
        ...emptyData(),
        error: 'No data in Redis',
      })
    }
    
    const positions = (redisData.positions || []).map((p: RawPosition) =>
      mapPosition(p, redisData.last_prices || {})
    )
    const closedPositions = (redisData.closed_positions || []).map(mapClosedPosition)
    
    return NextResponse.json({
      positions,
      closedPositions,
      realizedPnL: redisData.realized_pnl ?? 0,
      cycleCount: redisData.cycle_count ?? 0,
      lastRun: redisData.last_run,
      source: 'redis',
    })
  } catch (err: any) {
    console.error('Redis error:', err?.message || err)
    return NextResponse.json({
      ...emptyData(),
      error: 'Redis connection failed',
      message: err?.message,
    })
  }
}
