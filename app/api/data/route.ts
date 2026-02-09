import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { getTradingStateFromRedis, isRedisConfigured } from '@/lib/redis'
import type {
  TradingData,
  Position,
  ClosedPosition,
  RawTraderState,
  RawPosition,
  RawClosedPosition,
} from '@/lib/types'

const STATE_FILE_PATH = path.resolve(
  process.cwd(),
  '../polymarket-agents-official/data/autonomous_trader_state.json'
)

function mapPosition(raw: RawPosition, lastPrices: RawTraderState['last_prices']): Position {
  const priceInfo = lastPrices[raw.market_id]
  const currentPrice = priceInfo?.price ?? raw.entry_price
  const pnlPct = priceInfo?.pnl_pct ?? 0
  const currentPnL = raw.size * pnlPct

  return {
    marketId: raw.market_id,
    question: raw.question,
    strategy: raw.strategy,
    action: raw.action,
    size: raw.size,
    entryPrice: raw.entry_price,
    currentPrice,
    edge: raw.edge,
    confidence: raw.confidence,
    timestamp: raw.timestamp,
    currentPnL,
    currentPnLPct: pnlPct * 100,
  }
}

function mapClosedPosition(raw: RawClosedPosition): ClosedPosition {
  return {
    marketId: raw.market_id,
    question: raw.question,
    strategy: raw.strategy,
    action: raw.action,
    size: raw.size,
    entryPrice: raw.entry_price,
    edge: raw.edge,
    confidence: raw.confidence,
    timestamp: raw.timestamp,
    exitTimestamp: raw.exit_timestamp,
    exitPrice: raw.exit_price,
    realizedPnL: raw.realized_pnl,
    realizedPnLPct: raw.realized_pnl_pct,
    exitReason: raw.exit_reason,
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
  // Try Redis first
  if (isRedisConfigured()) {
    try {
      console.log('Connecting to Redis...')
      const redisData = await getTradingStateFromRedis()
      console.log('Redis data fetched:', redisData ? 'found' : 'not found')
      
      if (redisData) {
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
      }
    } catch (err: any) {
      console.error('Redis error:', err?.message || err)
      return NextResponse.json({ 
        error: 'Redis connection failed', 
        message: err?.message,
        ...emptyData() 
      }, { status: 500 })
    }
  } else {
    console.log('Redis not configured')
  }
  
  // Fall back to file system
  try {
    const fileContent = await readFile(STATE_FILE_PATH, 'utf-8')
    const raw: RawTraderState = JSON.parse(fileContent)

    const positions = (raw.positions || []).map((p) =>
      mapPosition(p, raw.last_prices || {})
    )
    const closedPositions = (raw.closed_positions || []).map(mapClosedPosition)

    return NextResponse.json({
      positions,
      closedPositions,
      realizedPnL: raw.realized_pnl ?? 0,
      cycleCount: raw.cycle_count ?? 0,
      lastRun: raw.last_run,
      source: 'filesystem',
    })
  } catch (err: any) {
    console.error('Failed to read trader state:', err?.message)
    return NextResponse.json(emptyData())
  }
}
