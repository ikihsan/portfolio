'use client'

import { useAnalytics } from '../lib/analytics/tracker'

/**
 * Client component that initializes analytics tracking.
 * Renders nothing — just hooks into the page lifecycle.
 */
export default function AnalyticsTracker() {
  useAnalytics()
  return null
}