import { NextResponse } from 'next/server'
import { trackActiveVisitor } from '../../../../lib/redis'
import { getRedis, isRedisAvailable } from '../../../../lib/redis'

export async function POST(request) {
  try {
    const { anonymousId, sessionId, path, timestamp } = await request.json()
    
    if (!anonymousId || !sessionId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Check Redis availability first
    if (!isRedisAvailable()) {
      const redis = getRedis()
      if (!redis) {
        return NextResponse.json({ success: true, redis: false })
      }
    }

    await trackActiveVisitor(anonymousId, sessionId, path || '/', null, null, null)
    
    return NextResponse.json({ success: true, redis: true })
  } catch (error) {
    console.error('Heartbeat error:', error.message)
    return NextResponse.json({ success: true, error: error.message })
  }
}
