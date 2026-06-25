import { Redis } from '@upstash/redis'

let redisClient = null

export function getRedis() {
  if (!redisClient) {
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN
    if (!url || !token) {
      return null
    }
    try {
      redisClient = new Redis({ url, token })
    } catch {
      return null
    }
  }
  return redisClient
}

export function isRedisAvailable() {
  return getRedis() !== null
}

export const ACTIVE_VISITOR_TTL = 120
export const CACHE_TTL = {
  DASHBOARD: 30,
  POPULAR_PAGES: 60,
  RECENT_ACTIVITY: 15,
  STATS: 30,
}

export const KEYS = {
  activeVisitor: (id) => `active:visitor:${id}`,
  activeVisitorKey: 'active:visitor',
  activePages: 'active:pages',
  activeCountries: 'active:countries',
  dashboardCache: (period) => `cache:dashboard:${period}`,
  popularPages: 'cache:popular:pages',
  geostats: (period) => `cache:geo:${period}`,
  techstats: (period) => `cache:tech:${period}`,
  sources: (period) => `cache:sources:${period}`,
  rateLimit: (ip) => `ratelimit:${ip}`,
  heartbeat: (id) => `heartbeat:${id}`,
}

export async function trackActiveVisitor(visitorId, sessionId, page, country, device, browser) {
  const redis = getRedis()
  if (!redis) return

  const member = `${visitorId}:${sessionId}`
  const key = KEYS.activeVisitor(member)

  try {
    const payload = JSON.stringify({
      visitorId,
      sessionId,
      page: page || '/',
      country: country || null,
      device: device || null,
      browser: browser || null,
      lastSeen: Date.now(),
    })

    await redis.setex(key, ACTIVE_VISITOR_TTL, payload)

    if (page) {
      await redis.sadd(KEYS.activePages, page)
      await redis.expire(KEYS.activePages, ACTIVE_VISITOR_TTL * 2)
    }
    if (country) {
      await redis.sadd(KEYS.activeCountries, country)
      await redis.expire(KEYS.activeCountries, ACTIVE_VISITOR_TTL * 2)
    }
  } catch (error) {
    console.error('trackActiveVisitor error:', error.message)
  }
}

export async function getActiveVisitorsDetail() {
  const redis = getRedis()
  if (!redis) return { count: 0, pages: [], countries: [] }

  try {
    const [visitorKeys, pages, countries] = await Promise.all([
      redis.keys(`${KEYS.activeVisitorKey}:*`),
      redis.smembers(KEYS.activePages),
      redis.smembers(KEYS.activeCountries),
    ])

    const validMembers = new Set()
    const pageCounts = {}
    const countryCounts = {}

    if (pages) {
      pages.forEach((page) => {
        pageCounts[page] = (pageCounts[page] || 0) + 1
      })
    }

    if (countries) {
      countries.forEach((country) => {
        countryCounts[country] = (countryCounts[country] || 0) + 1
      })
    }

    return {
      count: visitorKeys.length,
      pages: Object.entries(pageCounts).map(([page, count]) => ({ page, visitors: count })),
      countries: Object.entries(countryCounts).map(([country, count]) => ({ country, visitors: count })),
    }
  } catch {
    return { count: 0, pages: [], countries: [] }
  }
}

export async function getActiveVisitorCount() {
  const redis = getRedis()
  if (!redis) return 0
  try {
    const keys = await redis.keys('active:visitor:*')
    return keys.length
  } catch {
    return 0
  }
}

export async function removeActiveVisitor(visitorId, sessionId) {
  const redis = getRedis()
  if (!redis) return
  const member = `${visitorId}:${sessionId}`
  try {
    await redis.del(KEYS.activeVisitor(member))
  } catch {
    // silent
  }
}

export async function getCached(key) {
  const redis = getRedis()
  if (!redis) return null
  try {
    const data = await redis.get(key)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export async function setCache(key, data, ttl) {
  const redis = getRedis()
  if (!redis) return
  try {
    await redis.setex(key, ttl, JSON.stringify(data))
  } catch {
    // silent fail
  }
}