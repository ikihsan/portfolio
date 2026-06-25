'use client'

import { useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'

// Simple anonymous ID generator (localStorage persisted)
function getAnonymousId() {
  if (typeof window === 'undefined') return null
  let id = localStorage.getItem('analytics_visitor_id')
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : 
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
      })
    localStorage.setItem('analytics_visitor_id', id)
  }
  return id
}

function getSessionId() {
  if (typeof window === 'undefined') return null
  let sid = sessionStorage.getItem('analytics_session_id')
  if (!sid) {
    sid = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2)
    sessionStorage.setItem('analytics_session_id', sid)
  }
  return sid
}

function getPageCategory(path) {
  if (path === '/' || path === '') return 'home'
  const segments = path.split('/').filter(Boolean)
  return segments[0] || 'unknown'
}

// Heartbeat to keep active visitor status alive
function startHeartbeat(anonymousId, sessionId, path) {
  const interval = setInterval(async () => {
    try {
      await fetch('/api/analytics/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anonymousId, sessionId, path, timestamp: Date.now() }),
        keepalive: true,
      })
    } catch {
      // silent
    }
  }, 30000) // every 30 seconds
  return interval
}

// Track a page view
async function trackPageView(data) {
  try {
    // Use sendBeacon for reliability on page unload
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
      navigator.sendBeacon('/api/analytics/track', blob)
    } else {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true,
      })
    }
  } catch {
    // Silent fail — analytics should never break UX
  }
}

// Track an event
async function trackEvent(data) {
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
      navigator.sendBeacon('/api/analytics/event', blob)
    } else {
      await fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true,
      })
    }
  } catch {
    // silent
  }
}

// Track page leave / session end
function trackPageLeave(anonymousId, sessionId, path) {
  if (typeof window === 'undefined') return
  
  const handleBeforeUnload = () => {
    navigator.sendBeacon('/api/analytics/end-session', 
      new Blob([JSON.stringify({ anonymousId, sessionId, exitPath: path })], { type: 'application/json' })
    )
  }
  
  window.addEventListener('beforeunload', handleBeforeUnload)
  return () => window.removeEventListener('beforeunload', handleBeforeUnload)
}

// Get client info
function getClientInfo() {
  if (typeof window === 'undefined') return {}
  return {
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    touchCapable: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    pixelRatio: window.devicePixelRatio || 1,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    language: navigator.language || navigator.userLanguage || 'en',
    colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  }
}

// React hook for page tracking
export function useAnalytics() {
  const pathname = usePathname()
  const prevPathRef = useRef('')
  const heartbeatRef = useRef(null)
  const cleanupRef = useRef(null)

  useEffect(() => {
    const anonymousId = getAnonymousId()
    const sessionId = getSessionId()
    const path = pathname || '/'
    
    // Track page view
    if (path !== prevPathRef.current) {
      const isReturning = localStorage.getItem('analytics_has_visited') === 'true'
      if (!isReturning) {
        localStorage.setItem('analytics_has_visited', 'true')
      }

      const clientInfo = getClientInfo()
      
      // Get referrer and UTM params
      let referrer = document.referrer || ''
      let utmSource = ''
      let utmMedium = ''
      let utmCampaign = ''

      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search)
        utmSource = params.get('utm_source') || ''
        utmMedium = params.get('utm_medium') || ''
        utmCampaign = params.get('utm_campaign') || ''
      }

      trackPageView({
        anonymousId,
        sessionId,
        path,
        pageTitle: document.title,
        pageCategory: getPageCategory(path),
        referrer,
        utmSource,
        utmMedium,
        utmCampaign,
        ...clientInfo,
        isReturning,
      })

      prevPathRef.current = path
    }

    // Start heartbeat
    if (heartbeatRef.current) clearInterval(heartbeatRef.current)
    heartbeatRef.current = startHeartbeat(anonymousId, sessionId, path)

    // Track page leave
    if (cleanupRef.current) cleanupRef.current()
    cleanupRef.current = trackPageLeave(anonymousId, sessionId, path)

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current)
      if (cleanupRef.current) cleanupRef.current()
    }
  }, [pathname])

  // Return helper for manual event tracking
  const track = useCallback((eventType, eventCategory, eventLabel, eventValue, path, metadata) => {
    const anonymousId = getAnonymousId()
    const sessionId = getSessionId()
    trackEvent({
      anonymousId,
      sessionId,
      eventType,
      eventCategory,
      eventLabel,
      eventValue,
      path: path || pathname,
      metadata,
    })
  }, [pathname])

  return { track }
}