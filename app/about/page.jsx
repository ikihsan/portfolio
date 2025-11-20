// Admin note: Edit content in this file to customize the About page.
"use client"
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

// Typewriter hook for bio
function useTypewriter(text, speed = 50) {
  const [displayText, setDisplayText] = useState('')
  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(timer)
      }
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])
  return displayText
}

export default function About() {
  const bioText = "From childhood, I've aspired to be a hacker—now building secure backends and innovative systems."
  const typedBio = useTypewriter(bioText)

  return (
    <section className="min-h-screen text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Profile Hero */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="relative inline-block mb-6">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-lg"
            >
              <Image
                src="/myimg.jpg"
                alt="Profile"
                width={128}
                height={128}
                className="object-cover"
              />
            </motion.div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Ihsanul Hak IK</h1>
          <p className="text-xl text-gray-300">Backend Developer | API Builder | Full-Stack Engineer</p>
        </motion.div>

        {/* Bio Code Block */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="bg-black/40 border border-white/10 rounded-lg p-6 font-mono text-sm mb-12"
        >
          <div className="text-neon mb-2">const bio = {'{'}</div>
          <div className="ml-4">
            <div><span className="text-blue-400">name:</span> "Ihsanul Hak IK",</div>
            <div><span className="text-blue-400">role:</span> "Full-Stack Developer",</div>
            <div><span className="text-blue-400">passion:</span> "Building scalable APIs and thoughtful software",</div>
            <div><span className="text-blue-400">stack:</span> ["Node.js", "NestJS", "WebSockets", "PostgreSQL", "Firebase"],</div>
            <div><span className="text-blue-400">description:</span> "{typedBio}"</div>
          </div>
          <div className="text-neon">{'}'}</div>
        </motion.div>

        {/* Resume Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="bg-black/40 border border-white/10 rounded-lg p-8 text-center mb-12"
        >
          <div className="mb-4">
            <div className="text-3xl mb-2">📄</div>
            <h3 className="text-xl font-bold text-neon mb-2">Resume</h3>
            <p className="text-gray-300 text-sm">Dive deeper into my experience and skills</p>
          </div>
          <div className="flex gap-4 justify-center">
            <a
              href="/files/ihsan_ik.pdf"
              download="Ihsanul_Hak_IK_Resume.pdf"
              className="px-6 py-3 bg-neon/10 text-neon border border-neon/20 rounded-lg hover:bg-neon/20 transition font-medium"
            >
              ↓ Download Resume
            </a>
            <a
              href="/files/ihsan_ik.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition font-medium"
            >
              👁 View Resume
            </a>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {[
            { label: 'Git Commits', value: '2000+' },
            { label: 'Pull Requests Merged', value: '150+' },
            { label: 'Bugs Squashed', value: '500+' },
            { label: 'Coffees Brewed', value: '1000+' }
          ].map((stat, i) => (
            <div key={i} className="bg-black/40 border border-white/6 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-neon">{stat.value}</div>
              <div className="text-sm text-gray-300">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center"
        >
          <p className="text-gray-400 mb-4">Ready to collaborate?</p>
          <a href="/contact" className="inline-block px-6 py-3 bg-neon/10 text-neon border border-neon/20 rounded hover:bg-neon/20 transition">
            Run 'contact' command
          </a>
        </motion.div>
      </div>
    </section>
  )
}