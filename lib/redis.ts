// Simple Redis REST API client for Vercel serverless
// Compatible with Upstash Redis

const REDIS_URL = process.env.REDIS_URL || process.env.KV_URL
const KV_REST_API_URL = process.env.KV_REST_API_URL
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN

export function isRedisConfigured(): boolean {
  return !!(REDIS_URL || KV_REST_API_URL)
}

function getRestApiConfig() {
  // Prefer Vercel KV environment variables
  if (KV_REST_API_URL && KV_REST_API_TOKEN) {
    return {
      baseUrl: KV_REST_API_URL,
      token: KV_REST_API_TOKEN,
    }
  }
  
  // Parse from REDIS_URL
  if (!REDIS_URL) {
    return null
  }
  
  try {
    const url = new URL(REDIS_URL)
    // Upstash REST API format: https://host/rest/command/arg1/arg2
    const restUrl = `https://${url.host}`
    const token = url.password
    
    return { baseUrl: restUrl, token }
  } catch {
    return null
  }
}

export async function getTradingStateFromRedis(): Promise<any | null> {
  const config = getRestApiConfig()
  if (!config) {
    return null
  }

  try {
    const response = await fetch(`${config.baseUrl}/get/trading:state`, {
      headers: {
        'Authorization': `Bearer ${config.token}`,
      },
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      console.error('Redis REST API error:', response.status, await response.text())
      return null
    }

    const result = await response.json()
    
    // Upstash returns { result: "value" } or { result: null }
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
  const config = getRestApiConfig()
  if (!config) {
    throw new Error('Redis not configured')
  }

  const value = JSON.stringify(state)
  
  try {
    const response = await fetch(`${config.baseUrl}/set/trading:state/${encodeURIComponent(value)}`, {
      headers: {
        'Authorization': `Bearer ${config.token}`,
      },
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      throw new Error(`Redis set failed: ${response.status}`)
    }
  } catch (err: any) {
    console.error('Redis set error:', err?.message)
    throw err
  }
}
