// Admin note: Edit content in this file to customize the Blog index.
"use client"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Blog() {
  const [stage, setStage] = useState('loading') // loading, error, reveal

  useEffect(() => {
    const timer1 = setTimeout(() => setStage('error'), 3500) // 3s loading
    const timer2 = setTimeout(() => setStage('reveal'), 8000) // 5s error
    return () => { clearTimeout(timer1); clearTimeout(timer2) }
  }, [])

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-4xl w-full">
        <AnimatePresence mode="wait">
          {stage === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="bg-black/40 border border-white/10 rounded-lg p-8 font-mono text-sm">
                <div className="text-neon mb-4">$ fetch blogs --latest</div>
                <div className="text-gray-300">Initializing blog matrix...</div>
                <div className="text-gray-300">Connecting to database...</div>
                <div className="text-gray-300">Decrypting posts...</div>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="mt-4 text-neon"
                >
                  Loading... ██████████ 100%
                </motion.div>
              </div>
            </motion.div>
          )}

          {stage === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-8 font-mono text-sm">
                <div className="text-red-400 mb-4 text-2xl font-bold">SYSTEM ERROR</div>
                <div className="text-red-300">Error 404: Blog fetch failed</div>
                <div className="text-red-300">Connection to blog server compromised</div>
                <div className="text-red-300">Firewall breached. Data encrypted.</div>
                <div className="text-red-300 mt-4">Hacker detected. Initiating countermeasures...</div>
                <motion.div
                  animate={{ x: [-10, 10, -10] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className="mt-4 text-red-500 text-xl"
                >
                  ⚠ ALERT ⚠
                </motion.div>
              </div>
            </motion.div>
          )}

          {stage === 'reveal' && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="bg-black/40 border border-neon rounded-lg p-8">
                <div className="text-4xl mb-4">😈</div>
                <h2 className="text-2xl font-bold text-neon mb-4">Gotcha!</h2>
                <p className="text-gray-300 mb-6">
                  Just a little hacker humor. Blogs are coming soon—I'm busy building epic backends and fooling systems like this one.
                </p>
                <p className="text-gray-400 text-sm">
                  In the meantime, check out my <a href="/work" className="text-neon hover:underline">work</a> or <a href="/contact" className="text-neon hover:underline">drop a line</a>.
                </p>
                <button
                  onClick={() => setStage('loading')}
                  className="mt-6 px-4 py-2 bg-neon/10 text-neon border border-neon/20 rounded hover:bg-neon/20"
                >
                  Retry Hack
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}