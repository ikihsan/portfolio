// Admin note: Edit content in this file to customize the Blog index.
"use client"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
export default function Blog() {
  const [stage, setStage] = useState('loading') // loading, blogs

  useEffect(() => {
    const timer = setTimeout(() => setStage('blogs'), 2000) // 3.5s loading
    return () => clearTimeout(timer)
  }, [])

  const blogs = [
    {
      id: 1,
      title: "Building Scalable APIs with NestJS and GraphQL",
      excerpt: "Exploring the power of type-safe APIs and efficient data fetching...",
      date: "2024-11-15",
      readTime: "5 min read",
      tags: ["NestJS", "GraphQL", "Backend"]
    },
    {
      id: 2,
      title: "Optimizing Database Queries in Prisma",
      excerpt: "Best practices for efficient database operations and performance tuning...",
      date: "2024-10-28",
      readTime: "7 min read",
      tags: ["Prisma", "PostgreSQL", "Performance"]
    },
    {
      id: 3,
      title: "Real-time Communication with WebSockets",
      excerpt: "Implementing live chat and notifications in modern web applications...",
      date: "2024-10-10",
      readTime: "6 min read",
      tags: ["WebSockets", "Real-time", "Node.js"]
    }
  ]

  return (
    <section className="min-h-screen px-6 flex justify-center items-start py-20">
      <div className="max-w-4xl w-full">
        <AnimatePresence mode="wait">
          {stage === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
              className="flex items-center justify-center min-h-screen w-full text-center"
            >
              <div className="bg-black/40 border border-white/10 rounded-lg p-8 font-mono text-sm w-full">
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
         
          {stage === 'blogs' && (
            <motion.div
              key="blogs"
              initial={{ opacity: 0,  }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Blog</h1>
                <p className="text-gray-400 text-lg">Thoughts on code, backend wizardry, and developer life</p>
              </div>

              <div className="space-y-8">
                {blogs.map((blog, index) => (
                  <motion.article
                    key={blog.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-black/40 border border-white/10 rounded-lg p-6 hover:border-neon/30 transition-colors"
                  >
                    <div className="flex flex-wrap gap-2 mb-3">
                      {blog.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-neon/10 text-neon text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2 hover:text-neon transition-colors cursor-pointer">
                      {blog.title}
                    </h2>
                    <p className="text-gray-300 mb-4">{blog.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>{blog.date}</span>
                      <span>{blog.readTime}</span>
                    </div>
                  </motion.article>
                ))}
              </div>

              <div className="text-center mt-12">
                <p className="text-gray-400">More posts coming soon... Stay tuned!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}