import { getDB } from '../db'
import { getRedis, trackActiveVisitor, getActiveVisitorCount, getActiveVisitorsDetail, getCached, setCache, KEYS, CACHE_TTL } from '../redis'

// ========== UPSERT HELPEzRS ==========

async function upsertCountry(code, name) {
  if (!code) return null
  const db = getDB()
  const result = await db.query(
    `INSERT INTO countries (code, name) VALUES ($1, $2)
     ON CONFLICT (code) DO UPDATE SET name = $2
     RETURNING id`,
    [code.toUpperCase(), name || code.toUpperCase()]
  )
  return result[0]?.id || null
}

async function upsertRegion(countryId, name) {
  if (!countryId || !name) return null
  const db = getDB()
  const result = await db.query(
    `INSERT INTO regions (country_id, name) VALUES ($1, $2)
     ON CONFLICT (country_id, name) DO UPDATE SET name = $2
     RETURNING id`,
    [countryId, name]
  )
  return result[0]?.id || null
}

async function upsertCity(regionId, name) {
  if (!regionId || !name) return null
  const db = getDB()
  const result = await db.query(
    `INSERT INTO cities (region_id, name) VALUES ($1, $2)
     ON CONFLICT (region_id, name) DO UPDATE SET name = $2
     RETURNING id`,
    [regionId, name]
  )
  return result[0]?.id || null
}

async function upsertDevice(type, screenResolution, touchCapable, pixelRatio) {
  if (!type) return null
  const db = getDB()
  const result = await db.query(
    `INSERT INTO devices (type, screen_resolution, touch_capable, pixel_ratio)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (type, screen_resolution, touch_capable, pixel_ratio)
     DO UPDATE SET type = $1
     RETURNING id`,
    [type, screenResolution || 'Unknown', !!touchCapable, pixelRatio || 1.0]
  )
  return result[0]?.id || null
}

async function upsertBrowser(name, version) {
  if (!name) return null
  const db = getDB()
  const result = await db.query(
    `INSERT INTO browsers (name, version) VALUES ($1, $2)
     ON CONFLICT (name, version) DO UPDATE SET name = $1
     RETURNING id`,
    [name, version || 'Unknown']
  )
  return result[0]?.id || null
}

async function upsertOS(name, version) {
  if (!name) return null
  const db = getDB()
  const result = await db.query(
    `INSERT INTO operating_systems (name, version) VALUES ($1, $2)
     ON CONFLICT (name, version) DO UPDATE SET name = $1
     RETURNING id`,
    [name, version || 'Unknown']
  )
  return result[0]?.id || null
}

async function upsertLanguage(code) {
  if (!code) return null
  const db = getDB()
  const result = await db.query(
    `INSERT INTO languages (code) VALUES ($1)
     ON CONFLICT (code) DO UPDATE SET code = $1
     RETURNING id`,
    [code]
  )
  return result[0]?.id || null
}

async function upsertTrafficSource(source, medium, campaign) {
  if (!source) return null
  const db = getDB()
  const result = await db.query(
    `INSERT INTO traffic_sources (source, medium, campaign)
     VALUES ($1, $2, $3)
     ON CONFLICT (source, medium, campaign)
     DO UPDATE SET source = $1
     RETURNING id`,
    [source, medium || 'direct', campaign || '']
  )
  return result[0]?.id || null
}

async function upsertPage(path, title, category) {
  if (!path) return null
  const db = getDB()
  const result = await db.query(
    `INSERT INTO pages (path, title, category) VALUES ($1, $2, $3)
     ON CONFLICT (path) DO UPDATE SET title = COALESCE($2, pages.title), category = COALESCE($3, pages.category)
     RETURNING id`,
    [path, title || null, category || null]
  )
  return result[0]?.id || null
}

// ========== COUNTRY DETECTION ==========

function detectCountryFromTimezone(timezone) {
  const tzMap = {
    'America/New_York': { code: 'US', name: 'United States' },
    'America/Chicago': { code: 'US', name: 'United States' },
    'America/Denver': { code: 'US', name: 'United States' },
    'America/Los_Angeles': { code: 'US', name: 'United States' },
    'Europe/London': { code: 'GB', name: 'United Kingdom' },
    'Europe/Berlin': { code: 'DE', name: 'Germany' },
    'Europe/Paris': { code: 'FR', name: 'France' },
    'Asia/Kolkata': { code: 'IN', name: 'India' },
    'Asia/Tokyo': { code: 'JP', name: 'Japan' },
    'Asia/Shanghai': { code: 'CN', name: 'China' },
    'Asia/Singapore': { code: 'SG', name: 'Singapore' },
    'Asia/Dubai': { code: 'AE', name: 'United Arab Emirates' },
    'Australia/Sydney': { code: 'AU', name: 'Australia' },
    'Europe/Moscow': { code: 'RU', name: 'Russia' },
    'America/Sao_Paulo': { code: 'BR', name: 'Brazil' },
    'America/Toronto': { code: 'CA', name: 'Canada' },
    'Europe/Amsterdam': { code: 'NL', name: 'Netherlands' },
    'Europe/Stockholm': { code: 'SE', name: 'Sweden' },
    'Asia/Seoul': { code: 'KR', name: 'South Korea' },
    'Asia/Jakarta': { code: 'ID', name: 'Indonesia' },
    'Asia/Kuala_Lumpur': { code: 'MY', name: 'Malaysia' },
    'Asia/Bangkok': { code: 'TH', name: 'Thailand' },
    'Asia/Ho_Chi_Minh': { code: 'VN', name: 'Vietnam' },
    'Asia/Manila': { code: 'PH', name: 'Philippines' },
    'Asia/Dhaka': { code: 'BD', name: 'Bangladesh' },
    'Asia/Karachi': { code: 'PK', name: 'Pakistan' },
    'Asia/Tehran': { code: 'IR', name: 'Iran' },
    'Africa/Cairo': { code: 'EG', name: 'Egypt' },
    'Africa/Lagos': { code: 'NG', name: 'Nigeria' },
    'Africa/Nairobi': { code: 'KE', name: 'Kenya' },
    'Europe/Istanbul': { code: 'TR', name: 'Turkey' },
  }
  return tzMap[timezone] || null
}

function detectRegionFromTimezone(timezone) {
  const regionMap = {
    'America/New_York': 'New York',
    'America/Chicago': 'Illinois',
    'America/Denver': 'Colorado',
    'America/Los_Angeles': 'California',
    'America/Toronto': 'Ontario',
    'Europe/London': 'England',
    'Asia/Kolkata': 'Karnataka',
  }
  return regionMap[timezone] || null
}

function detectCityFromTimezone(timezone) {
  const cityMap = {
    'America/New_York': 'New York City',
    'America/Chicago': 'Chicago',
    'America/Denver': 'Denver',
    'America/Los_Angeles': 'Los Angeles',
    'Europe/London': 'London',
    'Asia/Kolkata': 'Bangalore',
    'Asia/Tokyo': 'Tokyo',
    'Asia/Singapore': 'Singapore',
    'Asia/Dubai': 'Dubai',
    'Australia/Sydney': 'Sydney',
  }
  return cityMap[timezone] || null
}

// ========== SESSION MANAGEMENT ==========

let sessionCounter = 0

export async function trackPageView(data) {
  const db = getDB()
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
  } = data

  try {
    // Parse user agent
    const ua = parseUserAgent(userAgent)
    const deviceType = detectDeviceType(userAgent, touchCapable, screenWidth)
    const screenRes = screenWidth && screenHeight ? `${screenWidth}x${screenHeight}` : 'Unknown'

    // Upsert dimension data
    const browserId = await upsertBrowser(ua.browser, ua.browserVersion)
    const osId = await upsertOS(ua.os, ua.osVersion)
    const deviceId = await upsertDevice(deviceType, screenRes, touchCapable, pixelRatio)
    const languageId = await upsertLanguage(language)

    // Detect country from timezone
    const countryInfo = detectCountryFromTimezone(timezone)
    let countryId = null
    let regionId = null
    let cityId = null
    if (countryInfo) {
      countryId = await upsertCountry(countryInfo.code, countryInfo.name)
      const regionName = detectRegionFromTimezone(timezone)
      if (regionName) {
        regionId = await upsertRegion(countryId, regionName)
        const cityName = detectCityFromTimezone(timezone)
        if (cityName) {
          cityId = await upsertCity(regionId, cityName)
        }
      }
    }

    // Upsert traffic source
    const trafficSource = detectTrafficSource(referrer, utmSource)
    const trafficSourceId = await upsertTrafficSource(
      utmSource || trafficSource.source,
      utmMedium || trafficSource.medium,
      utmCampaign
    )

    // Upsert page
    const pageId = await upsertPage(path, pageTitle, pageCategory)

    // Upsert visitor
    let visitorResult = await db.query(
      `SELECT id, visit_count FROM visitors WHERE anonymous_id = $1`,
      [anonymousId]
    )

    let visitorId
    let visitCount = 1
    if (visitorResult.length > 0) {
      visitorId = visitorResult[0].id
      visitCount = visitorResult[0].visit_count + 1
      await db.query(
        `UPDATE visitors SET 
          last_visit_at = NOW(), 
          visit_count = $2,
          country_id = COALESCE($3, country_id),
          region_id = COALESCE($4, region_id),
          city_id = COALESCE($5, city_id),
          language_id = COALESCE($6, language_id),
          timezone = COALESCE($7, timezone),
          device_id = COALESCE($8, device_id),
          browser_id = COALESCE($9, browser_id),
          os_id = COALESCE($10, os_id),
          color_scheme = COALESCE($11, color_scheme)
        WHERE id = $1`,
        [visitorId, visitCount, countryId, regionId, cityId, languageId, timezone, deviceId, browserId, osId, colorScheme]
      )
    } else {
      visitorResult = await db.query(
        `INSERT INTO visitors (anonymous_id, country_id, region_id, city_id, language_id, timezone, device_id, browser_id, os_id, color_scheme)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING id`,
        [anonymousId, countryId, regionId, cityId, languageId, timezone, deviceId, browserId, osId, colorScheme]
      )
      visitorId = visitorResult[0].id
    }

    // Upsert session
    let sessionResult = await db.query(
      `SELECT id, page_views_count FROM sessions WHERE id = $1`,
      [sessionId]
    )

    sessionCounter++

    if (sessionResult.length > 0) {
      // Update existing session
      await db.query(
        `UPDATE sessions SET 
          page_views_count = page_views_count + 1,
          bounce = false,
          updated_at = NOW()
        WHERE id = $1`,
        [sessionId]
      )
    } else {
      // Create new session
      await db.query(
        `INSERT INTO sessions (id, visitor_id, landing_page_id, traffic_source_id, is_returning, page_views_count)
         VALUES ($1, $2, $3, $4, $5, 1)`,
        [sessionId, visitorId, pageId, trafficSourceId, isReturning ? true : visitCount > 1]
      )
    }

    // Insert page view
    await db.query(
      `INSERT INTO page_views (visitor_id, session_id, page_id, is_entrance, scroll_depth)
       VALUES ($1, $2, $3, $4, 0)`,
      [visitorId, sessionId, pageId, sessionCounter === 1]
    )

    // Track in Redis for live updates
    await trackActiveVisitor(
      anonymousId,
      sessionId,
      path,
      countryInfo?.code || 'Unknown',
      deviceType,
      ua.browser
    )

    // Update daily stats
    await updateDailyStats(new Date())

    return { visitorId, sessionId, pageId }
  } catch (error) {
    console.error('Analytics tracking error:', error.message)
    // Don't throw — analytics should never break the page
    return null
  }
}

// ========== EVENT TRACKING ==========

export async function trackEvent(data) {
  const db = getDB()
  const { anonymousId, sessionId, eventType, eventCategory, eventLabel, eventValue, path, metadata } = data

  try {
    const pageId = path ? await upsertPage(path) : null

    // Get visitor
    const visitorResult = await db.query(
      `SELECT id FROM visitors WHERE anonymous_id = $1`,
      [anonymousId]
    )
    if (visitorResult.length === 0) return null
    const visitorId = visitorResult[0].id

    await db.query(
      `INSERT INTO events (visitor_id, session_id, event_type, event_category, event_label, event_value, page_id, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [visitorId, sessionId, eventType, eventCategory, eventLabel, eventValue || null, pageId, metadata ? JSON.stringify(metadata) : null]
    )

    // Update daily stats for downloads/interactions
    if (eventCategory === 'download') {
      await incrementDailyStat(new Date(), 'downloads')
    } else if (eventCategory === 'interaction' || eventCategory === 'click') {
      await incrementDailyStat(new Date(), 'interactions')
    }
  } catch (error) {
    console.error('Event tracking error:', error.message)
  }
}

// ========== SESSION END ==========

export async function endSession(sessionId, exitPath) {
  const db = getDB()
  try {
    const pageResult = exitPath ? await upsertPage(exitPath) : null

    // Calculate session duration
    const session = await db.query(
      `SELECT started_at FROM sessions WHERE id = $1`,
      [sessionId]
    )
    if (session.length === 0) return

    const startedAt = new Date(session[0].started_at)
    const duration = Math.floor((Date.now() - startedAt.getTime()) / 1000)

    // Update exit page info and duration on all page views in session
    await db.query(
      `UPDATE page_views SET is_exit = true WHERE session_id = $1 AND id = (
        SELECT id FROM page_views WHERE session_id = $1 ORDER BY entered_at DESC LIMIT 1
      )`,
      [sessionId]
    )

    await db.query(
      `UPDATE sessions SET 
        ended_at = NOW(),
        duration_seconds = $2,
        exit_page_id = COALESCE($3, exit_page_id)
      WHERE id = $1`,
      [sessionId, duration, pageResult]
    )

    // Get visitor ID to remove from active
    const visitorResult = await db.query(
      `SELECT visitor_id FROM sessions WHERE id = $1`,
      [sessionId]
    )
    // Remove from active visitors via Redis
    const redisInstance = getRedis()
    if (visitorResult.length > 0 && redisInstance) {
      const visitorData = await db.query(
        `SELECT v.anonymous_id FROM visitors v JOIN sessions s ON s.visitor_id = v.id WHERE s.id = $1`,
        [sessionId]
      )
      if (visitorData.length > 0) {
        const member = `${visitorData[0].anonymous_id}:${sessionId}`
        await redisInstance.zrem('active:visitors', member)
      }
    }
  } catch (error) {
    console.error('End session error:', error.message)
  }
}

// ========== DAILY STATISTICS ==========

async function updateDailyStats(date) {
  const db = getDB()
  const day = date.toISOString().split('T')[0]

  try {
    // Aggregate today's data
    const visitorCount = await db.query(
      `SELECT COUNT(DISTINCT visitor_id) as count FROM page_views WHERE DATE(entered_at) = $1`,
      [day]
    )

    const uniqueCount = await db.query(
      `SELECT COUNT(DISTINCT v.id) as count FROM visitors v
       JOIN sessions s ON s.visitor_id = v.id
       WHERE DATE(s.started_at) = $1`,
      [day]
    )

    const returningCount = await db.query(
      `SELECT COUNT(DISTINCT v.id) as count FROM visitors v
       JOIN sessions s ON s.visitor_id = v.id
       WHERE DATE(s.started_at) = $1 AND s.is_returning = true`,
      [day]
    )

    const pageViewCount = await db.query(
      `SELECT COUNT(*) as count FROM page_views WHERE DATE(entered_at) = $1`,
      [day]
    )

    const sessionCount = await db.query(
      `SELECT COUNT(*) as count FROM sessions WHERE DATE(started_at) = $1`,
      [day]
    )

    const bounceCount = await db.query(
      `SELECT COUNT(*) as count FROM sessions WHERE DATE(started_at) = $1 AND bounce = true`,
      [day]
    )

    const durationResult = await db.query(
      `SELECT COALESCE(SUM(duration_seconds), 0) as total FROM sessions WHERE DATE(started_at) = $1`,
      [day]
    )

    await db.query(
      `INSERT INTO daily_statistics (date, visitors, unique_visitors, returning_visitors, page_views, sessions, bounce_count, total_duration_seconds)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (date) DO UPDATE SET
         visitors = $2,
         unique_visitors = $3,
         returning_visitors = $4,
         page_views = $5,
         sessions = $6,
         bounce_count = $7,
         total_duration_seconds = $8`,
      [
        day,
        visitorCount[0]?.count || 0,
        uniqueCount[0]?.count || 0,
        returningCount[0]?.count || 0,
        pageViewCount[0]?.count || 0,
        sessionCount[0]?.count || 0,
        bounceCount[0]?.count || 0,
        parseInt(durationResult[0]?.total) || 0,
      ]
    )
  } catch (error) {
    console.error('Daily stats update error:', error.message)
  }
}

async function incrementDailyStat(date, field) {
  const db = getDB()
  const day = date.toISOString().split('T')[0]

  try {
    await db.query(
      `INSERT INTO daily_statistics (date, ${field})
       VALUES ($1, 1)
       ON CONFLICT (date) DO UPDATE SET ${field} = daily_statistics.${field} + 1`,
      [day]
    )
  } catch (error) {
    console.error('Increment daily stat error:', error.message)
  }
}

// ========== USER AGENT PARSING ==========

function parseUserAgent(ua) {
  if (!ua) return { browser: 'Unknown', browserVersion: '', os: 'Unknown', osVersion: '' }

  let browser = 'Unknown'
  let browserVersion = ''
  let os = 'Unknown'
  let osVersion = ''

  // Browser detection
  if (ua.includes('Chrome') && !ua.includes('Edg')) {
    browser = 'Chrome'
    const match = ua.match(/Chrome\/([\d.]+)/)
    browserVersion = match ? match[1] : ''
  } else if (ua.includes('Firefox')) {
    browser = 'Firefox'
    const match = ua.match(/Firefox\/([\d.]+)/)
    browserVersion = match ? match[1] : ''
  } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
    browser = 'Safari'
    const match = ua.match(/Version\/([\d.]+)/)
    browserVersion = match ? match[1] : ''
  } else if (ua.includes('Edg')) {
    browser = 'Edge'
    const match = ua.match(/Edg\/([\d.]+)/)
    browserVersion = match ? match[1] : ''
  } else if (ua.includes('MSIE') || ua.includes('Trident')) {
    browser = 'Internet Explorer'
    browserVersion = 'Legacy'
  }

  // OS detection
  if (ua.includes('Windows')) {
    os = 'Windows'
    if (ua.includes('Windows NT 10.0')) osVersion = '10'
    else if (ua.includes('Windows NT 11.0')) osVersion = '11'
  } else if (ua.includes('Mac OS X')) {
    os = 'macOS'
    const match = ua.match(/Mac OS X ([\d_]+)/)
    osVersion = match ? match[1].replace(/_/g, '.') : ''
  } else if (ua.includes('Linux')) {
    os = 'Linux'
    if (ua.includes('Android')) {
      os = 'Android'
      const match = ua.match(/Android ([\d.]+)/)
      osVersion = match ? match[1] : ''
    }
  } else if (ua.includes('iPhone') || ua.includes('iPad')) {
    os = 'iOS'
    const match = ua.match(/OS ([\d_]+)/)
    osVersion = match ? match[1].replace(/_/g, '.') : ''
  } else if (ua.includes('CrOS')) {
    os = 'ChromeOS'
  }

  return { browser, browserVersion, os, osVersion }
}

function detectDeviceType(ua, touchCapable, screenWidth) {
  if (!ua) return 'desktop'
  if (ua.includes('Android') && ua.includes('Mobile')) return 'mobile'
  if (ua.includes('iPhone') || ua.includes('iPod')) return 'mobile'
  if (ua.includes('iPad')) return 'tablet'
  if (ua.includes('Tablet') || ua.includes('PlayBook')) return 'tablet'
  if (screenWidth && screenWidth < 768) return 'mobile'
  if (screenWidth && screenWidth < 1024) return 'tablet'
  if (touchCapable && screenWidth && screenWidth < 1024) return 'tablet'
  if (ua.includes('Android') && !ua.includes('Mobile')) return 'tablet'
  return 'desktop'
}

function detectTrafficSource(referrer, utmSource) {
  if (utmSource) {
    const sourceMap = {
      'google': { source: 'Google', medium: 'organic' },
      'github': { source: 'GitHub', medium: 'referral' },
      'linkedin': { source: 'LinkedIn', medium: 'referral' },
      'twitter': { source: 'Twitter/X', medium: 'social' },
      'x': { source: 'Twitter/X', medium: 'social' },
      'reddit': { source: 'Reddit', medium: 'social' },
      'hackernews': { source: 'Hacker News', medium: 'referral' },
      'dev.to': { source: 'Dev.to', medium: 'referral' },
      'facebook': { source: 'Facebook', medium: 'social' },
      'instagram': { source: 'Instagram', medium: 'social' },
      'youtube': { source: 'YouTube', medium: 'social' },
      'dribbble': { source: 'Dribbble', medium: 'referral' },
      'behance': { source: 'Behance', medium: 'referral' },
    }
    return sourceMap[utmSource.toLowerCase()] || { source: utmSource, medium: 'referral' }
  }

  if (!referrer || referrer === '' || referrer === 'Direct') {
    return { source: 'Direct', medium: 'direct' }
  }

  try {
    const url = new URL(referrer)
    const hostname = url.hostname.toLowerCase()

    if (hostname.includes('google.')) return { source: 'Google', medium: 'organic' }
    if (hostname.includes('github.')) return { source: 'GitHub', medium: 'referral' }
    if (hostname.includes('linkedin.')) return { source: 'LinkedIn', medium: 'referral' }
    if (hostname.includes('twitter.') || hostname.includes('x.com')) return { source: 'Twitter/X', medium: 'social' }
    if (hostname.includes('reddit.')) return { source: 'Reddit', medium: 'social' }
    if (hostname.includes('news.ycombinator.')) return { source: 'Hacker News', medium: 'referral' }
    if (hostname.includes('dev.to')) return { source: 'Dev.to', medium: 'referral' }
    if (hostname.includes('facebook.')) return { source: 'Facebook', medium: 'social' }
    if (hostname.includes('t.co')) return { source: 'Twitter/X', medium: 'social' }
    if (hostname.includes('instagram.')) return { source: 'Instagram', medium: 'social' }

    return { source: hostname.replace('www.', '').split('.')[0], medium: 'referral' }
  } catch {
    return { source: 'Direct', medium: 'direct' }
  }
}

// ========== QUERY FUNCTIONS ==========

export async function getStats(timeRange = '7d', fromDate, toDate) {
  const db = getDB()
  const { startDate, endDate, previousStartDate } = getDateRange(timeRange, fromDate, toDate)

  try {
    // Current period stats
    const currentStats = await db.query(
      `SELECT
        COUNT(DISTINCT pv.visitor_id) as total_visitors,
        COUNT(DISTINCT s.id) as total_sessions,
        COUNT(DISTINCT v.id) as unique_visitors,
        COUNT(DISTINCT CASE WHEN s.is_returning THEN v.id END) as returning_visitors,
        COUNT(*) as total_page_views,
        COUNT(DISTINCT CASE WHEN s.bounce THEN s.id END) as bounce_count,
        COALESCE(SUM(pv.duration_seconds), 0) as total_duration
      FROM page_views pv
      JOIN sessions s ON s.id = pv.session_id
      JOIN visitors v ON v.id = pv.visitor_id
      WHERE pv.entered_at >= $1 AND pv.entered_at < $2`,
      [startDate, endDate]
    )

    const {
      total_visitors,
      total_sessions,
      unique_visitors,
      returning_visitors,
      total_page_views,
      bounce_count,
      total_duration
    } = currentStats[0] || {}

    // Previous period for comparison
    const previousStats = previousStartDate ? await db.query(
      `SELECT
        COUNT(DISTINCT pv.visitor_id) as visitors,
        COUNT(DISTINCT s.id) as sessions
      FROM page_views pv
      JOIN sessions s ON s.id = pv.session_id
      WHERE pv.entered_at >= $1 AND pv.entered_at < $2`,
      [previousStartDate, startDate]
    ) : [{ visitors: 0, sessions: 0 }]

    const averageDuration = total_sessions > 0 ? Math.round(total_duration / total_sessions) : 0
    const bounceRate = total_sessions > 0 ? Math.round((bounce_count / total_sessions) * 100) : 0
    const pagesPerSession = total_sessions > 0 ? Math.round((total_page_views / total_sessions) * 10) / 10 : 0

    const currentVisitors = parseInt(total_visitors) || 0
    const currentSessions = parseInt(total_sessions) || 0
    const previousVisitors = parseInt(previousStats[0]?.visitors) || 0
    const previousSessions = parseInt(previousStats[0]?.sessions) || 0

    const visitorGrowth = previousVisitors > 0 ? Math.round(((currentVisitors - previousVisitors) / previousVisitors) * 100) : null
    const sessionGrowth = previousSessions > 0 ? Math.round(((currentSessions - previousSessions) / previousSessions) * 100) : null

    return {
      totalVisitors: currentVisitors,
      totalSessions: currentSessions,
      uniqueVisitors: parseInt(unique_visitors) || 0,
      returningVisitors: parseInt(returning_visitors) || 0,
      totalPageViews: parseInt(total_page_views) || 0,
      averageSessionDuration: averageDuration,
      bounceRate,
      pagesPerSession,
      visitorGrowth,
      sessionGrowth,
    }
  } catch (error) {
    console.error('Get stats error:', error.message)
    return null
  }
}

export async function getDailyStats(timeRange = '7d', fromDate, toDate) {
  const db = getDB()
  const { startDate, endDate } = getDateRange(timeRange, fromDate, toDate)

  try {
    const results = await db.query(
      `SELECT
        DATE(pv.entered_at) as date,
        COUNT(DISTINCT pv.visitor_id) as visitors,
        COUNT(*) as page_views,
        COUNT(DISTINCT s.id) as sessions
      FROM page_views pv
      JOIN sessions s ON s.id = pv.session_id
      WHERE pv.entered_at >= $1 AND pv.entered_at < $2
      GROUP BY DATE(pv.entered_at)
      ORDER BY date ASC`,
      [startDate, endDate]
    )

    return results.map(r => ({
      date: r.date,
      visitors: parseInt(r.visitors) || 0,
      pageViews: parseInt(r.page_views) || 0,
      sessions: parseInt(r.sessions) || 0,
    }))
  } catch (error) {
    console.error('Get daily stats error:', error.message)
    return []
  }
}

export async function getPopularPages(timeRange = '7d', fromDate, toDate, limit = 10) {
  const db = getDB()
  const { startDate, endDate } = getDateRange(timeRange, fromDate, toDate)

  try {
    const results = await db.query(
      `SELECT
        p.path,
        p.title,
        p.category,
        COUNT(*) as views,
        COUNT(DISTINCT pv.visitor_id) as unique_visitors,
        ROUND(AVG(pv.duration_seconds)) as avg_duration
      FROM page_views pv
      JOIN pages p ON p.id = pv.page_id
      WHERE pv.entered_at >= $1 AND pv.entered_at < $2
      GROUP BY p.path, p.title, p.category
      ORDER BY views DESC
      LIMIT $3`,
      [startDate, endDate, limit]
    )

    return results
  } catch (error) {
    console.error('Get popular pages error:', error.message)
    return []
  }
}

export async function getGeoStats(timeRange = '7d', fromDate, toDate) {
  const db = getDB()
  const { startDate, endDate } = getDateRange(timeRange, fromDate, toDate)

  try {
    const countries = await db.query(
      `SELECT
        c.code,
        c.name,
        COUNT(DISTINCT pv.visitor_id) as visitors,
        COUNT(*) as page_views
      FROM page_views pv
      JOIN visitors v ON v.id = pv.visitor_id
      JOIN countries c ON c.id = v.country_id
      WHERE pv.entered_at >= $1 AND pv.entered_at < $2
      GROUP BY c.code, c.name
      ORDER BY visitors DESC`,
      [startDate, endDate]
    )

    return countries || []
  } catch (error) {
    console.error('Get geo stats error:', error.message)
    return []
  }
}

export async function getTechStats(timeRange = '7d', fromDate, toDate) {
  const db = getDB()
  const { startDate, endDate } = getDateRange(timeRange, fromDate, toDate)

  try {
    const [browsers, os, devices] = await Promise.all([
      db.query(
        `SELECT b.name, COUNT(DISTINCT pv.visitor_id) as count
         FROM page_views pv
         JOIN visitors v ON v.id = pv.visitor_id
         JOIN browsers b ON b.id = v.browser_id
         WHERE pv.entered_at >= $1 AND pv.entered_at < $2
         GROUP BY b.name ORDER BY count DESC`,
        [startDate, endDate]
      ),
      db.query(
        `SELECT o.name, COUNT(DISTINCT pv.visitor_id) as count
         FROM page_views pv
         JOIN visitors v ON v.id = pv.visitor_id
         JOIN operating_systems o ON o.id = v.os_id
         WHERE pv.entered_at >= $1 AND pv.entered_at < $2
         GROUP BY o.name ORDER BY count DESC`,
        [startDate, endDate]
      ),
      db.query(
        `SELECT d.type, COUNT(DISTINCT pv.visitor_id) as count
         FROM page_views pv
         JOIN visitors v ON v.id = pv.visitor_id
         JOIN devices d ON d.id = v.device_id
         WHERE pv.entered_at >= $1 AND pv.entered_at < $2
         GROUP BY d.type ORDER BY count DESC`,
        [startDate, endDate]
      ),
    ])

    return { browsers: browsers || [], os: os || [], devices: devices || [] }
  } catch (error) {
    console.error('Get tech stats error:', error.message)
    return { browsers: [], os: [], devices: [] }
  }
}

export async function getSourceStats(timeRange = '7d', fromDate, toDate) {
  const db = getDB()
  const { startDate, endDate } = getDateRange(timeRange, fromDate, toDate)

  try {
    const results = await db.query(
      `SELECT
        ts.source,
        ts.medium,
        COUNT(DISTINCT s.id) as sessions,
        COUNT(DISTINCT pv.visitor_id) as visitors
      FROM sessions s
      JOIN traffic_sources ts ON ts.id = s.traffic_source_id
      JOIN page_views pv ON pv.session_id = s.id
      WHERE pv.entered_at >= $1 AND pv.entered_at < $2
      GROUP BY ts.source, ts.medium
      ORDER BY visitors DESC`,
      [startDate, endDate]
    )

    return results || []
  } catch (error) {
    console.error('Get source stats error:', error.message)
    return []
  }
}

export async function getEventStats(timeRange = '7d', fromDate, toDate) {
  const db = getDB()
  const { startDate, endDate } = getDateRange(timeRange, fromDate, toDate)

  try {
    const results = await db.query(
      `SELECT
        event_category,
        event_type,
        COUNT(*) as count
      FROM events
      WHERE created_at >= $1 AND created_at < $2
      GROUP BY event_category, event_type
      ORDER BY count DESC`,
      [startDate, endDate]
    )

    return results || []
  } catch (error) {
    console.error('Get event stats error:', error.message)
    return []
  }
}

export async function getRecentEvents(limit = 20) {
  const db = getDB()

  try {
    const results = await db.query(
      `SELECT
        e.event_type,
        e.event_category,
        e.event_label,
        e.created_at,
        c.name as country,
        p.path as page
      FROM events e
      LEFT JOIN visitors v ON v.id = e.visitor_id
      LEFT JOIN countries c ON c.id = v.country_id
      LEFT JOIN pages p ON p.id = e.page_id
      WHERE e.created_at > NOW() - INTERVAL '24 hours'
      ORDER BY e.created_at DESC
      LIMIT $1`,
      [limit]
    )

    return results || []
  } catch (error) {
    console.error('Get recent events error:', error.message)
    return []
  }
}

export async function getMilestones() {
  const db = getDB()

  try {
    // Check and update milestones
    const totalVisitors = await db.query(
      `SELECT COUNT(*) as count FROM visitors`
    )
    const totalPageViews = await db.query(
      `SELECT COUNT(*) as count FROM page_views`
    )
    const countryCount = await db.query(
      `SELECT COUNT(DISTINCT country_id) as count FROM visitors WHERE country_id IS NOT NULL`
    )
    const totalDownloads = await db.query(
      `SELECT COUNT(*) as count FROM events WHERE event_category = 'download'`
    )
    const returningCount = await db.query(
      `SELECT COUNT(*) as count FROM visitors WHERE visit_count > 1`
    )

    const milestones = [
      { type: 'visitors', value: 100, label: '100 Visitors' },
      { type: 'visitors', value: 500, label: '500 Visitors' },
      { type: 'visitors', value: 1000, label: '1,000 Visitors' },
      { type: 'page_views', value: 1000, label: '1,000 Page Views' },
      { type: 'page_views', value: 5000, label: '5,000 Page Views' },
      { type: 'page_views', value: 10000, label: '10,000 Page Views' },
      { type: 'countries', value: 10, label: '10 Countries Reached' },
      { type: 'countries', value: 25, label: '25 Countries Reached' },
      { type: 'countries', value: 50, label: '50 Countries Reached' },
      { type: 'downloads', value: 50, label: '50 Resume Downloads' },
      { type: 'downloads', value: 100, label: '100 Resume Downloads' },
      { type: 'returning', value: 100, label: '100 Returning Visitors' },
      { type: 'returning', value: 500, label: '500 Returning Visitors' },
    ]

    const currentValues = {
      visitors: parseInt(totalVisitors[0]?.count) || 0,
      page_views: parseInt(totalPageViews[0]?.count) || 0,
      countries: parseInt(countryCount[0]?.count) || 0,
      downloads: parseInt(totalDownloads[0]?.count) || 0,
      returning: parseInt(returningCount[0]?.count) || 0,
    }

    const achieved = []
    for (const milestone of milestones) {
      if (currentValues[milestone.type] >= milestone.value) {
        try {
          await db.query(
            `INSERT INTO milestones (type, value, label) VALUES ($1, $2, $3)
             ON CONFLICT (type, value) DO NOTHING`,
            [milestone.type, milestone.value, milestone.label]
          )
          achieved.push(milestone)
        } catch {
          // Already exists
        }
      }
    }

    const allMilestones = await db.query(
      `SELECT * FROM milestones ORDER BY achieved_at DESC`
    )

    return allMilestones || []
  } catch (error) {
    console.error('Get milestones error:', error.message)
    return []
  }
}

// ========== DATE HELPERS ==========

function getDateRange(timeRange, from, to) {
  const now = new Date()
  let startDate, endDate = to ? new Date(to) : new Date(now)
  endDate.setHours(23, 59, 59, 999)

  if (from) {
    startDate = new Date(from)
  } else {
    startDate = new Date(now)
    switch (timeRange) {
      case '24h':
        startDate.setHours(startDate.getHours() - 24)
        break
      case '7d':
        startDate.setDate(startDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(startDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(startDate.getDate() - 90)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      default:
        startDate.setDate(startDate.getDate() - 7)
    }
  }

  startDate.setHours(0, 0, 0, 0)

  const duration = endDate.getTime() - startDate.getTime()
  const previousStartDate = new Date(startDate.getTime() - duration)

  return { startDate: startDate.toISOString(), endDate: endDate.toISOString(), previousStartDate: previousStartDate.toISOString() }
}

// ========== ACTIVE VISITORS ==========

export async function getActiveVisitors() {
  try {
    const { count, pages, countries } = await getActiveVisitorsDetail()
    return { count, pages, countries }
  } catch {
    return { count: 0, pages: [], countries: [] }
  }
}