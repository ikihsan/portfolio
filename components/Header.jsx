'use client'
import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { V2_URL } from '../data/links'
import ActiveVisitors from './ActiveVisitors'

// Header: responsive header with logo, nav links, social icons, and a creative v2 button.
export default function Header(){
  const [open, setOpen] = useState(false)

  const nav = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/ideas', label: 'Ideas', highlight: true },
    { href: '/blog', label: 'Blog' },
    { href: '/work', label: 'Work' },
    { href: '/contact', label: 'Contact' }
  ]

  return (
    <header className="fixed z-30 top-0 left-0 right-0 backdrop-blur-md bg-black/50 border-b border-white/6">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.svg" alt="Logo" className="w-9 h-9" />
            <span className="font-semibold">ikihsan.me</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {/* Active Visitors */}
          <ActiveVisitors />
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a aria-label="GitHub" href="https://github.com/ikihsan" className="opacity-80 hover:opacity-100">{/* GitHub SVG */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-200">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.166 6.84 9.49.5.09.68-.217.68-.483 0-.237-.009-.866-.014-1.7-2.78.603-3.37-1.34-3.37-1.34-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.528 2.341 1.087 2.91.832.091-.647.35-1.087.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.09.39-1.98 1.03-2.677-.103-.254-.447-1.27.098-2.645 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.845c.85.004 1.71.115 2.51.337 1.91-1.294 2.75-1.025 2.75-1.025.546 1.375.203 2.391.1 2.645.64.697 1.03 1.587 1.03 2.677 0 3.842-2.338 4.687-4.566 4.936.359.31.68.92.68 1.855 0 1.338-.012 2.418-.012 2.748 0 .267.18.577.688.48A10.003 10.003 0 0022 12c0-5.52-4.48-10-10-10z" fill="currentColor" />
              </svg>
            </a>
            <a aria-label="LinkedIn" href="https://linkedin.com/in/ikihsan" className="opacity-80 hover:opacity-100">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-200">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="currentColor" />
              </svg>
            </a>
          </div>

          {/* Nav Links */}
          {nav.map(item => (
            <Link key={item.href} href={item.href} className={`text-sm transition-all ${
              item.highlight 
                ? 'text-orange-400 hover:text-orange-300 font-medium flex items-center gap-1' 
                : 'text-gray-200/90 hover:text-white'
            }`}>
              {item.highlight && <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />}
              {item.label}
            </Link>
          ))}

          {/* —— Creative v2 Button —— */}
          <motion.a
            href={V2_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-full border border-neon/50 text-neon overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Background shimmer on hover */}
            <motion.span
              className="absolute inset-0 bg-neon/10"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
            {/* Sparkle icon */}
            <svg className="relative z-10 w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L13.09 8.91L20 10L13.09 11.09L12 18L10.91 11.09L4 10L10.91 8.91L12 2Z" fill="currentColor" />
            </svg>
            <span className="relative z-10">v2</span>
            {/* Arrow icon */}
            <svg className="relative z-10 w-3 h-3 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {/* Glow ring */}
            <span className="absolute inset-0 rounded-full ring-1 ring-neon/30 group-hover:ring-neon/70 transition-all duration-300" />
          </motion.a>
          {/* —— End v2 Button —— */}
        </nav>

        {/* Mobile Hamburger / X toggle */}
        <div className="md:hidden">
          <button
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(!open)}
            className="relative z-50 p-2"
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.svg
                  key="close"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <path d="M6 6l12 12M18 6l-12 12" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="menu"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <path d="M3 6h18M3 12h18M3 18h18" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
                </motion.svg>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile overlay backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile overlay menu — full-width panel sliding from top */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -16, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -16, scaleY: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }} // smooth spring-like easing
            className="fixed top-[58px] left-0 right-0 z-40 mx-4 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 md:hidden"
          >
            <nav className="flex flex-col px-5 py-5">
              {nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2, delay: i * 0.04 }}
                >
                  <Link 
                    href={item.href} 
                    onClick={() => setOpen(false)} 
                    className={`flex items-center gap-3 py-3.5 border-b border-white/6 ${
                      item.highlight ? 'text-orange-400' : 'text-gray-200'
                    }`}
                  >
                    {item.highlight && (
                      <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shrink-0" />
                    )}
                    <span className="font-medium">{item.label}</span>
                    {item.highlight && (
                      <span className="text-[10px] bg-orange-500/15 text-orange-400 px-2 py-0.5 rounded-full ml-auto font-semibold">
                        New
                      </span>
                    )}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile v2 button */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2, delay: 0.2 }}
              >
                <a
                  href={V2_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="mt-4 flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl border border-neon/40 text-neon font-semibold text-sm tracking-wider uppercase hover:bg-neon/10 transition-all duration-200"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L13.09 8.91L20 10L13.09 11.09L12 18L10.91 11.09L4 10L10.91 8.91L12 2Z" fill="currentColor" />
                  </svg>
                  Visit v2
                  <svg className="w-3.5 h-3.5 opacity-60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
