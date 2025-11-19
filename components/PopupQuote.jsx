'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QUOTES } from '../data/quotes'
import useReducedMotion from '../lib/useReducedMotion'

// PopupQuote: accessible modal that shows a random quote on first load
export default function PopupQuote(){
  const [visible, setVisible] = useState(false)
  const [quoteIndex, setQuoteIndex] = useState(0)
  const closeBtnRef = useRef(null)
  const mountedRef = useRef(false)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    mountedRef.current = true
    try {
      const saved = localStorage.getItem('ik_quote_seen')
      if (saved) {
        const ts = Number(saved)
        if (Date.now() - ts < 24 * 60 * 60 * 1000) return // don't show
      }
    } catch (e) {}

    // pick a random quote
    setQuoteIndex(Math.floor(Math.random() * QUOTES.length))
    setVisible(true)

    // No auto-dismiss; only closes on manual close
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleClose(reason = 'manual'){
    setVisible(false)
    try { localStorage.setItem('ik_quote_seen', String(Date.now())) } catch (e) {}
    // restore focus will be handled by effect on exit
  }

  useEffect(() => {
    if (visible) {
      // focus close button for keyboard users
      setTimeout(() => closeBtnRef.current?.focus(), 50)
    }
  }, [visible])

  function nextQuote(){
    setQuoteIndex(i => (i + 1) % QUOTES.length)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReduced ? 0 : 0.45 }}
          className="fixed inset-0 z-40 flex items-center justify-center"
          aria-hidden={!visible}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-filter duration-500" />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Motivational developer quote"
            initial={{ scale: prefersReduced ? 1 : 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: prefersReduced ? 1 : 0.96, opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.45 }}
            className="relative z-50 max-w-2xl w-full mx-4 p-6 md:p-8 bg-white/6 border border-white/10 rounded-xl shadow-xl backdrop-filter backdrop-blur-sm"
          >
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="text-2xl md:text-3xl font-semibold leading-tight">“{QUOTES[quoteIndex]}”</div>
                <div className="mt-3 text-sm text-gray-200/80">— Developer wisdom <span className="ml-2 text-xs text-neon">from the future</span></div>
              </div>

              <div className="flex flex-col gap-2">
                <button ref={closeBtnRef} onClick={() => handleClose('manual')} aria-label="Close quote" className="text-gray-200/90 hover:text-white">✕</button>
                <button onClick={nextQuote} className="text-sm text-neon/90 hover:underline">Next quote</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}