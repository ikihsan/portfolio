import { NextResponse } from 'next/server'
import { getRedis, isRedisAvailable } from '../../../../lib/redis'

export async function GET() {
  const redis = getRedis()
  const available = isRedisAvailable()
  
  let redisStatus = 'not_initialized'
  let pingResult = null
  
  if (redis) {
    try {
      pingResult = await redis.ping()
      redisStatus = pingResult ? 'connected' : 'connected_but_ping_failed'
    } catch (e) {
      redisStatus = 'error: ' + e.message
    }
  } else {
    redisStatus = 'null_client'
  }

  return NextResponse.json({
    redis: available,
    redisStatus,
    pingResult,
    env: {
      url: !!process.env.UPSTASH_REDIS_REST_URL,
      token: !!process.env.UPSTASH_REDIS_REST_TOKEN,
    }
  })
}