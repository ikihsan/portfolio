import { NextResponse } from 'next/server'
import { 
  getStats, 
  getDailyStats, 
  getPopularPages, 
  getGeoStats, 
  getTechStats, 
  getSourceStats, 
  getEventStats, 
  getRecentEvents, 
  getMilestones,
  getActiveVisitors 
} from '../../../../lib/analytics/engine'
import { getCached, setCache, KEYS, CACHE_TTL } from '../../../../lib/redis'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'overview'
    const period = searchParams.get('period') || '7d'
    const from = searchParams.get('from') || undefined
    const to = searchParams.get('to') || undefined
    const limit = parseInt(searchParams.get('limit') || '10')

    // Try cache first
    const cacheKey = `${KEYS.dashboardCache(type)}:${period}:${from || ''}:${to || ''}:${limit}`
    const cached = await getCached(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }

    let data
    let ttl = CACHE_TTL.DASHBOARD

    switch (type) {
      case 'active':
        try {
          data = await getActiveVisitors()
        } catch (e) {
          console.error('GET ACTIVE ERROR:', e.message)
          data = { count: 0, pages: [], countries: [] }
        }
        break
      case 'overview':
        data = await getStats(period, from, to)
        break
      case 'daily':
        data = await getDailyStats(period, from, to)
        break
      case 'pages':
        data = await getPopularPages(period, from, to, limit)
        break
      case 'geo':
        data = await getGeoStats(period, from, to)
        break
      case 'tech':
        data = await getTechStats(period, from, to)
        break
      case 'sources':
        data = await getSourceStats(period, from, to)
        break
      case 'events':
        data = await getEventStats(period, from, to)
        break
      case 'recent':
        data = await getRecentEvents(limit)
        break
      case 'milestones':
        data = await getMilestones()
        break
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    const response = { data, type, period, timestamp: Date.now() }

    // Cache the response
    if (type !== 'active' && type !== 'recent') {
      await setCache(cacheKey, response, ttl)
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Analytics data error:', error.message)
    return NextResponse.json({ error: 'Internal error', data: null }, { status: 500 })
  }
}