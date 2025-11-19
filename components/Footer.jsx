'use client'
import Link from 'next/link'

export default function Footer(){
  return (
    <footer className="relative z-10 border-t border-white/6 mt-12 py-8">
      <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-400">
        <div>© {new Date().getFullYear()} ikihsan.me — Built with care.</div>
        <div className="mt-2">
          <Link href="/" className="underline">Privacy</Link>
          <span className="mx-2">•</span>
          <Link href="/" className="underline">Terms</Link>
        </div>
      </div>
    </footer>
  )
}