'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ActiveVisitors() {
  const [count, setCount] = useState(0)
  const [prevCount, setPrevCount] = useState(0)
  const [showTooltip, setShowTooltip] = useState(false)
  const [details, setDetails] = useState(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    async function fetchActive() {
      try {
        const res = await fetch('/api/analytics/data?type=active')
        const json = await res.json()
        if (json?.data) {
          setPrevCount(count)
          setCount(json.data.count || 0)
          setDetails(json.data)
        }
      } catch {
        // silent
      }
    }

    fetchActive()
    intervalRef.current = setInterval(fetchActive, 15000) // poll every 15s

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div className="relative">
      <button
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-300 hover:text-white transition-colors"
        aria-label={`${count} active visitors`}
      >
        {/* Pulse dot */}
        <span className="relative flex w-2 h-2">
          <span className="absolute inline-flex w-full h-full rounded-full bg-green-400 opacity-75 animate-ping" />
          <span className="relative inline-flex w-2 h-2 rounded-full bg-green-500" />
        </span>
        
        {/* Animated counter */}
        <AnimatePresence mode="wait">
          <motion.span
            key={count}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="font-mono font-semibold tabular-nums"
          >
            {count}
          </motion.span>
        </AnimatePresence>
        
        <span className="hidden sm:inline">live</span>
      </button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 w-56 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-2xl pointer-events-none"
          >
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Active Visitors
            </div>
            <div className="text-2xl font-bold text-white mb-2 tabular-nums">{count}</div>
            
            {details?.pages?.length > 0 && (
              <div className="space-y-1">
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">Pages</div>
                {details.pages.slice(0, 3).map((p, i) => (
                  <div key={i} className="flex justify-between text-xs text-gray-300">
                    <span className="truncate max-w-[140px]">{p.page}</span>
                    <span className="text-gray-500 ml-2">{p.visitors}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-2 pt-2 border-t border-white/5 text-[10px] text-gray-500">
              Updates every 15s · Visitors expire after 2min of inactivity
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}