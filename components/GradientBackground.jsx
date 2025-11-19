'use client'
import { useEffect, useRef } from 'react'

/**
 * GradientBackground
 * - lightweight animated gradient using GPU transforms and subtle floating particles
 * - keeps CPU usage low by using CSS animations with hardware acceleration
 */
export default function GradientBackground(){
  const containerRef = useRef(null)

  useEffect(() => {
    // placeholder if we want to add JS-driven parallax later
    const el = containerRef.current
    return () => {}
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 will-change-transform transform-gpu animate-grad-move" style={{background: 'linear-gradient(135deg,#001021 0%, #001b3a 50%, #002b4d 100%)', filter: 'saturate(1.08)'}} aria-hidden />

      {/* subtle floating particles (pure CSS) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-10 top-8 w-1.5 h-1.5 bg-white/6 rounded-full blur-sm animate-[float_12s_linear_infinite]" />
        <div className="absolute left-1/2 top-24 w-2 h-2 bg-white/5 rounded-full blur-sm animate-[float_18s_linear_infinite]" />
        <div className="absolute right-16 top-1/3 w-0.5 h-0.5 bg-white/4 rounded-full blur-sm animate-[float_20s_linear_infinite]" />
      </div>

      <style jsx>{`
        @keyframes float { 0% { transform: translateY(0) } 50% { transform: translateY(-18px) } 100% { transform: translateY(0) } }
        .animate-[float_12s_linear_infinite] { animation: float 12s linear infinite; }
        .animate-[float_18s_linear_infinite] { animation: float 18s linear infinite; }
        .animate-[float_20s_linear_infinite] { animation: float 20s linear infinite; }
      `}</style>
    </div>
  )
}