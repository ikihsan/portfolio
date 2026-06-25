import { NextResponse } from 'next/server'
import { trackEvent } from '../../../../lib/analytics/engine'

export async function POST(request) {
  try {
    const body = await request.json()
    const { anonymousId, sessionId, eventType, eventCategory, eventLabel, eventValue, path, metadata } = body

    if (!anonymousId || !sessionId || !eventType || !eventCategory) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await trackEvent({
      anonymousId,
      sessionId,
      eventType,
      eventCategory,
      eventLabel,
      eventValue,
      path,
      metadata,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics event error:', error.message)
    return NextResponse.json({ success: true })
  }
}