import { NextResponse } from 'next/server'
import { endSession } from '../../../../lib/analytics/engine'

export async function POST(request) {
  try {
    const { anonymousId, sessionId, exitPath } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
    }

    await endSession(sessionId, exitPath)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: true })
  }
}