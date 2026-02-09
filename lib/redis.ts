import Redis from 'ioredis'

const REDIS_URL = process.env.REDIS_URL || process.env.KV_URL

let redis: Redis | null = null

export function isRedisConfigured(): boolean {
  return !!REDIS_URL
}

export function getRedisClient(): Redis | null {
  if (redis) {
    return redis
  }
  
  if (!REDIS_URL) {
    console.warn('REDIS_URL not set. Redis features will be disabled.')
    return null
  }
  
  // Create new Redis instance with optimized settings for serverless
  const isTls = REDIS_URL.startsWith('rediss://')
  
  redis = new Redis(REDIS_URL, {
    // TLS configuration for Upstash
    ...(isTls && {
      tls: {
        rejectUnauthorized: false
      }
    }),
    // Optimized for serverless/edge
    connectTimeout: 5000,      // 5s connection timeout
    commandTimeout: 3000,      // 3s command timeout
    lazyConnect: true,         // Don't connect immediately
    keepAlive: 0,              // Disable keep-alive for serverless
    maxRetriesPerRequest: 1,   // Minimize retries
    enableOfflineQueue: false, // Don't queue offline commands
    retryStrategy: (times) => {
      // Don't retry on serverless
      return null
    }
  })
  
  return redis
}

export const TRADING_STATE_KEY = 'trading:state'

export async function getTradingStateFromRedis() {
  const client = getRedisClient()
  if (!client) {
    throw new Error('Redis not configured')
  }
  
  try {
    // Ensure connection before command
    if (client.status !== 'ready') {
      await client.connect().catch(() => {
        // Connection failed
      })
    }
    
    if (client.status !== 'ready') {
      throw new Error('Redis not connected')
    }
    
    const data = await client.get(TRADING_STATE_KEY)
    if (!data) {
      return null
    }
    
    return JSON.parse(data)
  } finally {
    // Disconnect immediately for serverless
    try {
      await client.disconnect()
    } catch {}
  }
}

export async function setTradingStateInRedis(state: any) {
  const client = getRedisClient()
  if (!client) {
    throw new Error('Redis not configured')
  }
  
  try {
    if (client.status !== 'ready') {
      await client.connect().catch(() => {})
    }
    
    if (client.status !== 'ready') {
      throw new Error('Redis not connected')
    }
    
    await client.set(TRADING_STATE_KEY, JSON.stringify(state))
  } finally {
    try {
      await client.disconnect()
    } catch {}
  }
}
