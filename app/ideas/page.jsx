"use client"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

// RacerTune Feature Pillars
const pillars = [
  {
    id: 'voice-first',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <circle cx="32" cy="32" r="28" stroke="url(#voiceGrad)" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M32 18v28M24 24v16M40 22v20M48 28v8M16 28v8" stroke="url(#voiceGrad)" strokeWidth="3" strokeLinecap="round" />
        <defs>
          <linearGradient id="voiceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B35" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>
        </defs>
      </svg>
    ),
    title: 'Voice-First Engineering',
    subtitle: 'Eyes on track, not on screens',
    description: 'RacerTune delivers coaching through natural voice commands. No glancing at dashboards, no distractions—just pure focus on the racing line while your AI engineer speaks directly to you.',
    stats: [
      { label: 'Latency', value: '<200ms' },
      { label: 'Recognition', value: '99.2%' },
      { label: 'Languages', value: '12+' }
    ]
  },
  {
    id: 'physics-engine',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <circle cx="32" cy="32" r="20" stroke="#4B5563" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="32" cy="32" r="14" stroke="#FF6B35" strokeWidth="2" />
        <line x1="32" y1="32" x2="32" y2="16" stroke="#06B6D4" strokeWidth="2.5" />
        <line x1="32" y1="32" x2="44" y2="26" stroke="#FF6B35" strokeWidth="2.5" />
        <circle cx="32" cy="32" r="3" fill="#FF6B35" />
        <text x="50" y="20" fill="#9CA3AF" fontSize="8" fontFamily="monospace">G</text>
        <defs>
          <linearGradient id="physicsGrad">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#FF6B35" />
          </linearGradient>
        </defs>
      </svg>
    ),
    title: 'Physics-Based Limits',
    subtitle: 'Real engineering, not guesswork',
    description: 'Every suggestion is calculated from tire grip physics, g-force envelopes, and real-time telemetry. RacerTune never pushes you beyond what physics says is safe—because fast means nothing if you don\'t finish.',
    stats: [
      { label: 'Sensors', value: '6-axis' },
      { label: 'Refresh', value: '100Hz' },
      { label: 'Accuracy', value: '±0.5%' }
    ]
  },
  {
    id: 'adaptive-ai',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <path d="M20 44C16 40 16 32 20 28C24 24 32 24 32 28" stroke="#9CA3AF" strokeWidth="1.5" />
        <path d="M44 44C48 40 48 32 44 28C40 24 32 24 32 28" stroke="#9CA3AF" strokeWidth="1.5" />
        <path d="M32 28v20" stroke="#FF6B35" strokeWidth="2" strokeDasharray="3 3" />
        <circle cx="32" cy="32" r="3" fill="#4B5563" />
        <circle cx="32" cy="40" r="3" fill="#FF6B35" />
        <circle cx="32" cy="48" r="4" fill="#DC2626" />
        <path d="M24 16h16M28 12h8M20 20h24" stroke="#FF6B35" strokeWidth="1" opacity="0.5" />
      </svg>
    ),
    title: 'Adaptive Learning',
    subtitle: 'Gets smarter every lap',
    description: 'The AI learns your driving style, identifies your weak points, and progressively builds your skills. It tracks improvement across sessions and adjusts its coaching to your evolving ability.',
    stats: [
      { label: 'Data Points', value: '50K/lap' },
      { label: 'Learning', value: 'Real-time' },
      { label: 'Memory', value: 'Unlimited' }
    ]
  },
  {
    id: 'safety-philosophy',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <path d="M32 8L52 18V32C52 44 44 52 32 56C20 52 12 44 12 32V18L32 8Z" stroke="#10B981" strokeWidth="2" fill="none" />
        <path d="M32 16L44 22V32C44 40 38 46 32 48C26 46 20 40 20 32V22L32 16Z" fill="#10B981" fillOpacity="0.2" />
        <path d="M24 32L30 38L42 26" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Trust Over Performance',
    subtitle: 'The core philosophy',
    description: 'Unlike aggressive coaching that pushes limits recklessly, RacerTune builds confidence through consistent, physics-validated guidance. You\'ll go faster because you trust your engineer—not because you\'re scared into it.',
    stats: [
      { label: 'Safety Score', value: '100%' },
      { label: 'Incidents', value: '0 target' },
      { label: 'Trust', value: 'Earned' }
    ]
  }
]

// Tech Stack
const techStack = [
  { name: 'Kotlin', icon: '🎯', desc: 'Native Android' },
  { name: 'TensorFlow Lite', icon: '🧠', desc: 'On-device AI' },
  { name: 'GPS + IMU', icon: '📡', desc: 'Sensor fusion' },
  { name: 'Whisper AI', icon: '🎙️', desc: 'Voice recognition' },
  { name: 'Custom DSP', icon: '📊', desc: 'Signal processing' },
  { name: 'Real-time DB', icon: '⚡', desc: 'Live telemetry' }
]

// Timeline / Roadmap
const roadmap = [
  { phase: 'Alpha', status: 'completed', title: 'Core Engine', desc: 'Physics model & voice synthesis' },
  { phase: 'Beta', status: 'current', title: 'Track Learning', desc: 'Automatic track mapping via GPS' },
  { phase: 'v1.0', status: 'upcoming', title: 'Public Launch', desc: 'Android release on Play Store' },
  { phase: 'v2.0', status: 'future', title: 'iOS + Telemetry', desc: 'Apple support & OBD-II integration' }
]

// Metrics that matter
const metrics = [
  { value: '0.3s', label: 'Voice Latency', icon: '⚡' },
  { value: '50+', label: 'Track Corners Analyzed', icon: '🔄' },
  { value: '100Hz', label: 'Telemetry Refresh', icon: '📈' },
  { value: '∞', label: 'Learning Capacity', icon: '🧠' }
]

export default function IdeasPage() {
  const [activePillar, setActivePillar] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouse = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  return (
    <section className="min-h-screen pt-24 pb-20 relative overflow-hidden">
      {/* Animated background gradient following mouse */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 opacity-30"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,107,53,0.15), transparent 40%)`
        }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs font-mono text-orange-400 uppercase tracking-wider">Flagship Project</span>
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div className="w-16 h-16 relative">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                <defs>
                  <linearGradient id="heroOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF6B35"/>
                    <stop offset="100%" stopColor="#EA580C"/>
                  </linearGradient>
                  <linearGradient id="heroRedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#DC2626"/>
                    <stop offset="100%" stopColor="#FF6B35"/>
                  </linearGradient>
                </defs>
                <path d="M25 20 L25 80 L35 80 L35 55 L50 55 L65 80 L78 80 L60 52 C72 48 78 38 78 28 C78 18 68 20 50 20 L25 20 Z M35 28 L48 28 C60 28 68 32 68 40 C68 48 62 52 50 52 L35 52 L35 28 Z" fill="url(#heroRedGrad)"/>
                <path d="M10 60 L22 60 L28 45 L38 75 L48 55 L55 60 L90 60" stroke="url(#heroOrangeGrad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="text-white">RACER</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">TUNE</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl md:text-3xl text-gray-300 mb-4"
          >
            Your AI Race Engineer
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg text-orange-400 font-medium mb-8"
          >
            Trust over performance. Always.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="https://racertune.ikihsan.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="group px-8 py-4 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 flex items-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              Visit RacerTune
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="#pillars"
              className="px-8 py-4 rounded-lg border border-white/20 text-white font-medium hover:bg-white/10 transition-all duration-300"
            >
              Explore the Vision
            </a>
          </motion.div>
        </motion.div>

        {/* Metrics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24"
        >
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:border-orange-500/30 transition-colors"
            >
              <span className="text-2xl mb-2 block">{metric.icon}</span>
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                {metric.value}
              </div>
              <div className="text-sm text-gray-500 mt-1">{metric.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Core Pillars Section */}
        <div id="pillars" className="mb-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-xs font-mono text-orange-400 uppercase tracking-widest">The Foundation</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-2">Four Core Pillars</h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Every feature in RacerTune is built on these fundamental principles that make it different from any racing app.
            </p>
          </motion.div>

          {/* Pillar Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {pillars.map((pillar, i) => (
              <button
                key={pillar.id}
                onClick={() => setActivePillar(i)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activePillar === i
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {pillar.title}
              </button>
            ))}
          </div>

          {/* Active Pillar Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePillar}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12"
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Icon */}
                <div className="flex justify-center">
                  <div className="w-40 h-40 md:w-56 md:h-56">
                    {pillars[activePillar].icon}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <span className="text-xs font-mono text-orange-400 uppercase tracking-wider">
                    {pillars[activePillar].subtitle}
                  </span>
                  <h3 className="text-2xl md:text-4xl font-bold mt-2 mb-4">
                    {pillars[activePillar].title}
                  </h3>
                  <p className="text-gray-400 text-lg leading-relaxed mb-6">
                    {pillars[activePillar].description}
                  </p>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-4">
                    {pillars[activePillar].stats.map((stat) => (
                      <div key={stat.label} className="bg-black/40 rounded-lg px-4 py-3 border border-white/10">
                        <div className="text-xl font-bold text-orange-400">{stat.value}</div>
                        <div className="text-xs text-gray-500">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-orange-400 uppercase tracking-widest">Built With</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Technology Stack</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {techStack.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/5 border border-white/10 rounded-xl p-5 text-center hover:border-orange-500/30 transition-all cursor-default"
              >
                <span className="text-3xl block mb-2">{tech.icon}</span>
                <div className="font-semibold text-white">{tech.name}</div>
                <div className="text-xs text-gray-500 mt-1">{tech.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Roadmap */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-orange-400 uppercase tracking-widest">The Journey</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Development Roadmap</h2>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500 via-red-500 to-gray-800 hidden md:block" />

            <div className="space-y-8">
              {roadmap.map((item, i) => (
                <motion.div
                  key={item.phase}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  viewport={{ once: true }}
                  className={`flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className={`inline-block px-4 py-6 rounded-xl border transition-all ${
                      item.status === 'completed' ? 'bg-green-500/10 border-green-500/30' :
                      item.status === 'current' ? 'bg-orange-500/10 border-orange-500/30 animate-pulse' :
                      item.status === 'upcoming' ? 'bg-blue-500/10 border-blue-500/30' :
                      'bg-white/5 border-white/10'
                    }`}>
                      <span className={`text-xs font-mono uppercase tracking-wider ${
                        item.status === 'completed' ? 'text-green-400' :
                        item.status === 'current' ? 'text-orange-400' :
                        item.status === 'upcoming' ? 'text-blue-400' :
                        'text-gray-500'
                      }`}>
                        {item.phase}
                      </span>
                      <h3 className="text-xl font-bold mt-1">{item.title}</h3>
                      <p className="text-gray-400 text-sm mt-1">{item.desc}</p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className={`hidden md:flex w-4 h-4 rounded-full border-2 ${
                    item.status === 'completed' ? 'bg-green-500 border-green-400' :
                    item.status === 'current' ? 'bg-orange-500 border-orange-400 animate-ping' :
                    'bg-gray-700 border-gray-600'
                  }`} />

                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Vision Quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden mb-24"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20" />
          <div className="absolute inset-0 backdrop-blur-xl" />
          
          <div className="relative p-12 md:p-16 text-center">
            <svg className="w-12 h-12 mx-auto mb-6 text-orange-400 opacity-50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>
            
            <blockquote className="text-2xl md:text-4xl font-light text-white leading-relaxed max-w-4xl mx-auto">
              "The best race engineer doesn't make you faster by pushing harder—they make you faster by making you <span className="text-orange-400 font-semibold">trust</span> every corner."
            </blockquote>
            
            <p className="mt-6 text-gray-400">— The RacerTune Philosophy</p>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Experience the Future?</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            RacerTune is redefining what it means to have a race engineer. No expensive hardware. No complicated setup. Just you, your car, and an AI that truly understands racing.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://racertune.ikihsan.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="group px-10 py-5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 flex items-center gap-3"
            >
              🏎️ Explore RacerTune
              <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <Link
              href="/work"
              className="px-10 py-5 rounded-xl border border-white/20 text-white font-medium hover:bg-white/10 transition-all"
            >
              View All Projects
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
