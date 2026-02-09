// Simple Redis client for Vercel serverless
// Uses basic fetch approach instead of persistent connections

const REDIS_URL = process.env.REDIS_URL || process.env.KV_URL

export function isRedisConfigured(): boolean {
  return !!REDIS_URL
}

export async function getTradingStateFromRedis(): Promise<any | null> {
  if (!REDIS_URL) {
    return null
  }

  try {
    // Parse Redis URL
    const url = new URL(REDIS_URL)
    const isTls = REDIS_URL.startsWith('rediss://')
    
    // Use Upstash REST API format
    // Format: https://host/command/arg1/arg2...
    const restUrl = `https://${url.host}/get/trading:state`
    
    const response = await fetch(restUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${url.password}`,
      },
      // Short timeout for serverless
      signal: AbortSignal.timeout(3000),
    })

    if (!response.ok) {
      console.log('Redis REST API error:', response.status)
      return null
    }

    const result = await response.json()
    
    // Upstash returns { result: "base64encoded" }
    if (result.result) {
      return JSON.parse(result.result)
    }
    
    return null
  } catch (err: any) {
    console.error('Redis fetch error:', err?.message)
    return null
  }
}

export async function setTradingStateInRedis(state: any): Promise<void> {
  if (!REDIS_URL) {
    throw new Error('Redis not configured')
  }

  try {
    const url = new URL(REDIS_URL)
    const restUrl = `https://${url.host}/set/trading:state/${encodeURIComponent(JSON.stringify(state))}`
    
    const response = await fetch(restUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${url.password}`,
      },
      signal: AbortSignal.timeout(3000),
    })

    if (!response.ok) {
      throw new Error(`Redis set failed: ${response.status}`)
    }
  } catch (err: any) {
    console.error('Redis set error:', err?.message)
    throw err
  }
}
