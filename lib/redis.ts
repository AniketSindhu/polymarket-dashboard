import Redis from 'ioredis'

const REDIS_URL = process.env.REDIS_URL || process.env.KV_URL

if (!REDIS_URL) {
  console.warn('REDIS_URL not set. Redis features will be disabled.')
}

export const redis = REDIS_URL ? new Redis(REDIS_URL) : null

export const TRADING_STATE_KEY = 'trading:state'

export async function getTradingStateFromRedis() {
  if (!redis) {
    throw new Error('Redis not configured')
  }
  
  const data = await redis.get(TRADING_STATE_KEY)
  if (!data) {
    return null
  }
  
  return JSON.parse(data)
}

export async function setTradingStateInRedis(state: any) {
  if (!redis) {
    throw new Error('Redis not configured')
  }
  
  await redis.set(TRADING_STATE_KEY, JSON.stringify(state))
}
