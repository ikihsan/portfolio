'use client'
export default function Logo(){
  return (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden className="text-neon">
      <rect width="48" height="48" rx="10" fill="url(#g)" />
      <path d="M14 32v-16l10 8 10-8v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#001021" />
          <stop offset="100%" stopColor="#003a5a" />
        </linearGradient>
      </defs>
    </svg>
  )
}