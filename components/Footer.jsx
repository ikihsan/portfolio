'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Footer(){
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [scanMessages, setScanMessages] = useState([])
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

  const messages = [
    "$ privacy --scan",
    "Initializing privacy audit...",
    "Fetching user footprint..."
  ]

  const fetchUserData = async () => {
    setLoading(true)
    try {
      // Fetch IP + Geolocation + ISP + Network Type (via ipapi.co)
      const geoRes = await fetch("https://ipapi.co/json/")
      const geoData = await geoRes.json()

      const ipInfo = {
        ip: geoData.ip,
        city: geoData.city,
        region: geoData.region,
        country: geoData.country_name,
        isp: geoData.org,                          // ISP name
        network: geoData.network,                  // Network type (broadband/mobile)
        asn: geoData.asn,                          // Autonomous System Number
        country_code: geoData.country,             // 2-letter country code
      }

      // Browser and device info (via Navigator)
      const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        language: navigator.language,
      }

      setUserData({ ipInfo, deviceInfo })
    } catch (err) {
      console.error("Error fetching user data:", err)
      setUserData({ error: "Failed to fetch data. Stay vigilant." })
    }
    setLoading(false)
  }

  const handlePrivacyClick = (e) => {
    e.preventDefault()
    setPrivacyOpen(true)
    setScanMessages([])
    setCurrentMessageIndex(0)
    setUserData(null)
  }

  useEffect(() => {
    if (privacyOpen && currentMessageIndex < messages.length) {
      const delay = currentMessageIndex === 0 ? 1500 : 1000 // Longer delay for first message
      const timer = setTimeout(() => {
        setScanMessages(prev => [...prev, messages[currentMessageIndex]])
        setCurrentMessageIndex(prev => prev + 1)
      }, delay)
      return () => clearTimeout(timer)
    } else if (privacyOpen && currentMessageIndex >= messages.length) {
      fetchUserData()
    }
  }, [privacyOpen, currentMessageIndex])

  return (
    <>
      <footer className="relative z-10 border-t border-white/6 mt-12 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-400">
          <div>© {new Date().getFullYear()} ikihsan.me</div>
          <div className="mt-2">
            <button onClick={handlePrivacyClick} className="underline hover:text-white">Privacy</button>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {privacyOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setPrivacyOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black/90 border border-neon rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-neon">PRIVACY SCAN</h3>
                <button onClick={() => setPrivacyOpen(false)} className="text-gray-400 hover:text-white">✕</button>
              </div>

              <div className="font-mono text-sm text-green-400 mb-4">
                {scanMessages.map((msg, i) => <div key={i}>{msg}</div>)}
              </div>

              {loading && (
                <div className="text-center text-gray-300">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    Scanning... ██████████
                  </motion.div>
                </div>
              )}

              {userData && !loading && (
                <div className="space-y-4">
                  <div className="bg-black/50 p-4 rounded border border-gray-600">
                    <h4 className="text-neon font-bold mb-2">IP & Network Info:</h4>
                    <div className="space-y-1 text-sm">
                      <div>IP: {userData.ipInfo?.ip || 'N/A'}</div>
                      <div>Location: {userData.ipInfo?.city}, {userData.ipInfo?.region}, {userData.ipInfo?.country}</div>
                      <div>ISP: {userData.ipInfo?.isp || 'N/A'}</div>
                      <div>Network: {userData.ipInfo?.network || 'N/A'}</div>
                      <div>ASN: {userData.ipInfo?.asn || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="bg-black/50 p-4 rounded border border-gray-600">
                    <h4 className="text-neon font-bold mb-2">Device & Browser Info:</h4>
                    <div className="space-y-1 text-sm">
                      <div>Platform: {userData.deviceInfo?.platform || 'N/A'}</div>
                      <div>Screen: {userData.deviceInfo?.screenWidth}x{userData.deviceInfo?.screenHeight}</div>
                      <div>Language: {userData.deviceInfo?.language || 'N/A'}</div>
                      <div>User-Agent: {userData.deviceInfo?.userAgent?.slice(0, 50)}...</div>
                    </div>
                  </div>

                  <div className="text-center text-gray-500 text-xs mt-4">
                    Data fetched from public APIs. Stay secure out there.
                  </div>
                </div>
              )}

              {userData?.error && (
                <div className="text-red-400 text-center">{userData.error}</div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}