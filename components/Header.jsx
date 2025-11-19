'use client'
import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Header: responsive header with logo, nav links and social icons.
export default function Header(){
  const [open, setOpen] = useState(false)

  const nav = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
    { href: '/work', label: 'Work' },
    { href: '/contact', label: 'Contact' }
  ]

  return (
    <header className="fixed z-30 top-0 left-0 right-0 backdrop-blur-md bg-black/50 border-b border-white/6">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.svg" alt="Logo" className="w-9 h-9" />
            <span className="font-semibold">ikihsan.me</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
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

          {nav.map(item => (
            <Link key={item.href} href={item.href} className="text-sm text-gray-200/90 hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="md:hidden">
          <button aria-label="Toggle menu" onClick={() => setOpen(!open)} className="p-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-8 right-8 z-40 bg-black/90 rounded-lg p-6 shadow-lg"
          >

            <nav className="flex flex-col gap-4">
              {nav.map(item => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="text-lg py-2 border-b border-white/10">
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}