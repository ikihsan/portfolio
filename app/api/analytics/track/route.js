import { NextResponse } from 'next/server'
import { trackPageView } from '../../../../lib/analytics/engine'

export async function POST(request) {
  try {
    const body = await request.json()
    const {
      anonymousId,
      sessionId,
      path,
      pageTitle,
      pageCategory,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      screenWidth,
      screenHeight,
      touchCapable,
      pixelRatio,
      timezone,
      language,
      userAgent,
      colorScheme,
      isReturning,
    } = body

    // Validate required fields
    if (!anonymousId || !sessionId || !path) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Rate limiting check
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const { getRedis } = await import('../../../../lib/redis')
    const redis = getRedis()
    
    if (redis) {
      const rateKey = `ratelimit:analytics:${ip}`
      const count = await redis.incr(rateKey)
      if (count === 1) {
        await redis.expire(rateKey, 60)
      }
      if (count > 100) {
        return NextResponse.json({ error: 'Rate limited' }, { status: 429 })
      }
    }

    // Track the page view
    await trackPageView({
      anonymousId,
      sessionId,
      path,
      pageTitle,
      pageCategory,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      screenWidth,
      screenHeight,
      touchCapable,
      pixelRatio,
      timezone,
      language,
      userAgent,
      colorScheme,
      isReturning,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics track error:', error.message)
    // Never return error to client to avoid breaking UX
    return NextResponse.json({ success: true })
  }
}