import '../styles/globals.css'
import { Poppins } from 'next/font/google'
import GradientBackground from '../components/GradientBackground'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PopupQuote from '../components/PopupQuote'
import { Analytics } from "@vercel/analytics/next"

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300','400','500','600','700'],
  variable: '--font-poppins',
  display: 'swap',
  preload: true
})

export const metadata = {
  title: 'ikihsan.me — Build with intention',
  description: 'Minimal modern portfolio starter for ikihsan.me',
  openGraph: {
    title: 'ikihsan.me — Build with intention',
    description: 'Minimal modern portfolio starter for ikihsan.me',
    images: '/og-image.png'
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body className="min-h-screen bg-black text-white antialiased">
        <GradientBackground />
        <Header />
        <main className="relative z-20">
          <PopupQuote />
          {children}
          <Analytics />
        </main>
        <Footer />
      </body>
    </html>
  )
}