'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'

// Dynamic imports for charts (avoid SSR bundle bloat)
const AreaChart = dynamic(() => import('recharts').then(m => m.AreaChart), { ssr: false })
const Area = dynamic(() => import('recharts').then(m => m.Area), { ssr: false })
const BarChart = dynamic(() => import('recharts').then(m => m.BarChart), { ssr: false })
const Bar = dynamic(() => import('recharts').then(m => m.Bar), { ssr: false })
const XAxis = dynamic(() => import('recharts').then(m => m.XAxis), { ssr: false })
const YAxis = dynamic(() => import('recharts').then(m => m.YAxis), { ssr: false })
const CartesianGrid = dynamic(() => import('recharts').then(m => m.CartesianGrid), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then(m => m.Tooltip), { ssr: false })
const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false })
const PieChart = dynamic(() => import('recharts').then(m => m.PieChart), { ssr: false })
const Pie = dynamic(() => import('recharts').then(m => m.Pie), { ssr: false })
const Cell = dynamic(() => import('recharts').then(m => m.Cell), { ssr: false })

// ============== FETCHING ==============

async function fetchData(type, period = '7d', limit = 10) {
  try {
    const res = await fetch(`/api/analytics/data?type=${type}&period=${period}&limit=${limit}`)
    const json = await res.json()
    return json?.data || null
  } catch {
    return null
  }
}

// ============== COLOR PALETTE ==============

const COLORS = {
  neon: '#66f6ff',
  orange: '#f97316',
  purple: '#a855f7',
  pink: '#ec4899',
  green: '#22c55e',
  blue: '#3b82f6',
  yellow: '#eab308',
  red: '#ef4444',
  white: '#ffffff',
  gray: '#6b7280',
}

const CHART_COLORS = [
  '#66f6ff', '#a855f7', '#f97316', '#22c55e', 
  '#ec4899', '#3b82f6', '#eab308', '#ef4444',
  '#14b8a6', '#8b5cf6', '#f43f5e', '#0ea5e9',
]

// ============== FORMATTERS ==============

function formatNumber(num) {
  if (num === null || num === undefined) return '—'
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

function formatDuration(seconds) {
  if (!seconds || seconds === 0) return '—'
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ============== STAT CARD ==============

function StatCard({ label, value, change, icon, color = 'neon', isLoading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl border border-white/6 bg-black/40 backdrop-blur-sm p-4 sm:p-5"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">{label}</span>
        {icon && <span className="text-lg opacity-60">{icon}</span>}
      </div>
      {isLoading ? (
        <div className="h-8 w-20 rounded bg-white/5 animate-pulse" />
      ) : (
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold tabular-nums" style={{ color: COLORS[color] || COLORS.neon }}>
            {formatNumber(value)}
          </span>
          {change !== null && change !== undefined && (
            <span className={`text-xs font-medium ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
            </span>
          )}
        </div>
      )}
    </motion.div>
  )
}

// ============== SECTION HEADER ==============

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

// ============== PILL FILTER ==============

const PERIODS = [
  { value: '24h', label: '24H' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
]

function PeriodFilter({ value, onChange }) {
  return (
    <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
      {PERIODS.map(p => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            value === p.value
              ? 'bg-white/10 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}

// ============== MAIN PAGE ==============

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('7d')
  const [loading, setLoading] = useState(true)
  const [overview, setOverview] = useState(null)
  const [dailyStats, setDailyStats] = useState([])
  const [popularPages, setPopularPages] = useState([])
  const [geoStats, setGeoStats] = useState([])
  const [techStats, setTechStats] = useState(null)
  const [sourceStats, setSourceStats] = useState([])
  const [eventStats, setEventStats] = useState([])
  const [activeVisitors, setActiveVisitors] = useState(0)
  const [milestones, setMilestones] = useState([])
  const [recentEvents, setRecentEvents] = useState([])

  const loadData = useCallback(async (p) => {
    setLoading(true)
    try {
      const [ov, daily, pages, geo, tech, sources, events, active, milestonesData, recent] = await Promise.all([
        fetchData('overview', p),
        fetchData('daily', p),
        fetchData('pages', p, 8),
        fetchData('geo', p),
        fetchData('tech', p),
        fetchData('sources', p),
        fetchData('events', p),
        fetchData('active'),
        fetchData('milestones'),
        fetchData('recent', '24h', 10),
      ])
      if (ov) setOverview(ov)
      if (daily) setDailyStats(daily)
      if (pages) setPopularPages(pages)
      if (geo) setGeoStats(geo)
      if (tech) setTechStats(tech)
      if (sources) setSourceStats(sources)
      if (events) setEventStats(events)
      if (active) setActiveVisitors(active.count || 0)
      if (milestonesData) setMilestones(milestonesData)
      if (recent) setRecentEvents(recent)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData(period)
  }, [period, loadData])

  // Auto-refresh active visitors every 15s
  useEffect(() => {
    const interval = setInterval(async () => {
      const active = await fetchData('active')
      if (active) setActiveVisitors(active.count || 0)
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  // ============== RENDER ==============

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl font-bold text-white"
            >
              Analytics
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Public real-time dashboard for ikihsan.me
            </p>
          </div>
          <PeriodFilter value={period} onChange={setPeriod} />
        </div>

        {/* Active Visitors Banner */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-xl border border-green-500/20 bg-green-500/5 backdrop-blur-sm p-4 sm:p-5"
        >
          <div className="flex items-center gap-3">
            <span className="relative flex w-3 h-3">
              <span className="absolute inline-flex w-full h-full rounded-full bg-green-400 opacity-75 animate-ping" />
              <span className="relative inline-flex w-3 h-3 rounded-full bg-green-500" />
            </span>
            <div>
              <span className="text-xl sm:text-2xl font-bold text-white tabular-nums">{activeVisitors}</span>
              <span className="text-gray-400 ml-2">active visitors now</span>
            </div>
          </div>
        </motion.div>

        {/* Overview Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatCard label="Visitors" value={overview?.totalVisitors} change={overview?.visitorGrowth} icon="👥" isLoading={loading} />
          <StatCard label="Page Views" value={overview?.totalPageViews} icon="📄" color="purple" isLoading={loading} />
          <StatCard label="Sessions" value={overview?.totalSessions} change={overview?.sessionGrowth} icon="🔄" color="orange" isLoading={loading} />
          <StatCard label="Returning" value={overview?.returningVisitors} icon="🔁" color="green" isLoading={loading} />
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatCard label="Avg. Duration" value={overview?.averageSessionDuration ? formatDuration(overview.averageSessionDuration) : '—'} icon="⏱️" color="pink" isLoading={loading} />
          <StatCard label="Bounce Rate" value={overview?.bounceRate != null ? `${overview.bounceRate}%` : '—'} icon="📊" color="yellow" isLoading={loading} />
          <StatCard label="Pages / Session" value={overview?.pagesPerSession} icon="📑" color="blue" isLoading={loading} />
          <StatCard label="Unique Visitors" value={overview?.uniqueVisitors} icon="🌟" color="white" isLoading={loading} />
        </div>

        {/* Chart: Daily Visitors */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 rounded-xl border border-white/6 bg-black/40 backdrop-blur-sm p-4 sm:p-6"
        >
          <SectionHeader title="Traffic Over Time" subtitle="Daily visitors and page views" />
          <div className="h-64 sm:h-80">
            {dailyStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyStats} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.neon} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={COLORS.neon} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="pageViewGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.purple} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={COLORS.purple} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate} 
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#fff', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="visitors" stroke={COLORS.neon} strokeWidth={2} fill="url(#visitorGradient)" name="Visitors" />
                  <Area type="monotone" dataKey="pageViews" stroke={COLORS.purple} strokeWidth={2} fill="url(#pageViewGradient)" name="Page Views" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-600 text-sm">
                {loading ? 'Loading...' : 'No data yet'}
              </div>
            )}
          </div>
        </motion.div>

        {/* Two Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* Popular Pages */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-white/6 bg-black/40 backdrop-blur-sm p-4 sm:p-6"
          >
            <SectionHeader title="Popular Pages" subtitle="Most viewed paths" />
            {popularPages.length > 0 ? (
              <div className="space-y-2">
                {popularPages.map((page, i) => (
                  <div key={page.path} className="flex items-center gap-3 py-2">
                    <span className="text-xs text-gray-600 w-5 font-mono">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-300 truncate">{page.title || page.path}</span>
                        {page.category && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500 capitalize">{page.category}</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-600">{page.path}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-white tabular-nums">{formatNumber(page.views)}</div>
                      <div className="text-[10px] text-gray-600">views</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-600 text-sm">No page data yet</div>
            )}
          </motion.div>

          {/* Geography */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-xl border border-white/6 bg-black/40 backdrop-blur-sm p-4 sm:p-6"
          >
            <SectionHeader title="Geography" subtitle="Visitors by country" />
            {geoStats.length > 0 ? (
              <div className="space-y-2">
                {geoStats.slice(0, 8).map((geo, i) => (
                  <div key={geo.code} className="flex items-center gap-3 py-1.5">
                    <span className="text-base">{geo.code ? String.fromCodePoint(geo.code.toUpperCase().split('').map(c => 0x1F1E6 + c.charCodeAt(0) - 65).reduce((a, b) => a + b) || 127988) : '🌍'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-300">{geo.name || geo.code}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-white tabular-nums">{formatNumber(geo.visitors)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-600 text-sm">No geo data yet</div>
            )}
          </motion.div>
        </div>

        {/* Technology Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Browsers */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-white/6 bg-black/40 backdrop-blur-sm p-4 sm:p-5"
          >
            <SectionHeader title="Browsers" />
            {techStats?.browsers?.length > 0 ? (
              <div className="space-y-3">
                {techStats.browsers.slice(0, 5).map((b, i) => {
                  const total = techStats.browsers.reduce((sum, b) => sum + parseInt(b.count), 0)
                  const pct = total > 0 ? Math.round((parseInt(b.count) / total) * 100) : 0
                  return (
                    <div key={b.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-300">{b.name}</span>
                        <span className="text-gray-500">{pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="py-6 text-center text-gray-600 text-sm">No data</div>
            )}
          </motion.div>

          {/* Operating Systems */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-xl border border-white/6 bg-black/40 backdrop-blur-sm p-4 sm:p-5"
          >
            <SectionHeader title="Operating Systems" />
            {techStats?.os?.length > 0 ? (
              <div className="space-y-3">
                {techStats.os.slice(0, 5).map((o, i) => {
                  const total = techStats.os.reduce((sum, o) => sum + parseInt(o.count), 0)
                  const pct = total > 0 ? Math.round((parseInt(o.count) / total) * 100) : 0
                  return (
                    <div key={o.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-300">{o.name}</span>
                        <span className="text-gray-500">{pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: CHART_COLORS[(i + 2) % CHART_COLORS.length] }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="py-6 text-center text-gray-600 text-sm">No data</div>
            )}
          </motion.div>

          {/* Devices */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl border border-white/6 bg-black/40 backdrop-blur-sm p-4 sm:p-5"
          >
            <SectionHeader title="Devices" />
            {techStats?.devices?.length > 0 ? (
              <div className="space-y-3">
                {techStats.devices.slice(0, 5).map((d, i) => {
                  const total = techStats.devices.reduce((sum, d) => sum + parseInt(d.count), 0)
                  const pct = total > 0 ? Math.round((parseInt(d.count) / total) * 100) : 0
                  const icons = { desktop: '💻', mobile: '📱', tablet: '📟' }
                  return (
                    <div key={d.type}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-300">{icons[d.type] || '🖥️'} {d.type}</span>
                        <span className="text-gray-500">{pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: CHART_COLORS[(i + 4) % CHART_COLORS.length] }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="py-6 text-center text-gray-600 text-sm">No data</div>
            )}
          </motion.div>
        </div>

        {/* Traffic Sources + Live Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Traffic Sources */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="rounded-xl border border-white/6 bg-black/40 backdrop-blur-sm p-4 sm:p-6"
          >
            <SectionHeader title="Traffic Sources" subtitle="Where visitors come from" />
            {sourceStats.length > 0 ? (
              <div className="space-y-2">
                {sourceStats.map((src, i) => (
                  <div key={src.source} className="flex items-center gap-3 py-2">
                    <span className="text-sm w-6 text-center">{['🔗', '🔍', '🐙', '💼', '🐦', '🔴'][i] || '🌐'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-300">{src.source}</div>
                      <div className="text-[10px] text-gray-600">{src.medium}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-white tabular-nums">{formatNumber(src.visitors)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-600 text-sm">No source data yet</div>
            )}
          </motion.div>

          {/* Live Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl border border-white/6 bg-black/40 backdrop-blur-sm p-4 sm:p-6"
          >
            <SectionHeader title="Recent Activity" subtitle="Live feed from the last 24 hours" />
            {recentEvents.length > 0 ? (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {recentEvents.map((evt, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0"
                  >
                    <span className="text-base mt-0.5">
                      {evt.event_category === 'download' ? '📥' : 
                       evt.event_category === 'click' ? '👆' : 
                       evt.event_category === 'view' ? '👁️' : '⚡'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-300">
                        <span className="font-medium">{evt.event_label || evt.event_type}</span>
                        {evt.country && <span className="text-gray-600"> from {evt.country}</span>}
                      </div>
                      {evt.page && <div className="text-[10px] text-gray-600">{evt.page}</div>}
                    </div>
                    <div className="text-[10px] text-gray-600 whitespace-nowrap">
                      {new Date(evt.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-600 text-sm">No recent activity</div>
            )}
          </motion.div>
        </div>

        {/* Milestones */}
        {milestones.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mb-8 rounded-xl border border-white/6 bg-black/40 backdrop-blur-sm p-4 sm:p-6"
          >
            <SectionHeader title="🏆 Milestones" subtitle="Celebrating achievements" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {milestones.map((m, i) => (
                <div key={m.id || i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5">
                  <span className="text-lg">{['🎉', '🌟', '🚀', '👏', '💪', '🏅', '🎯', '🔥'][i % 8]}</span>
                  <span className="text-xs text-gray-300">{m.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer note */}
        <div className="text-center text-[11px] text-gray-600 py-8">
          Real-time analytics powered by PostgreSQL + Upstash Redis · Data updated every 30s
        </div>
      </div>
    </div>
  )
}