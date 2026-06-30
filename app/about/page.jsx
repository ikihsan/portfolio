"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

function useTypewriter(text, speed = 28)  {
  const [displayText, setDisplayText] = useState("")

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
  const bio =
    "Backend-focused software engineer with 1+ years building production APIs, real-time systems, enterprise applications, and modern payment infrastructure. I enjoy designing scalable backend architectures, solving complex engineering problems, and exploring systems programming with Rust."

  const typedBio = useTypewriter(bio)

  return (
    <section className="min-h-screen px-6 py-20 text-white">
      <div className="max-w-5xl mx-auto">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .8 }}
          className="text-center mb-16"
        >

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-block overflow-hidden rounded-full shadow-2xl mb-8"
          >
            <Image
              src="/myimg.jpg"
              alt="Ihsanul Hak IK"
              width={150}
              height={150}
              className="object-cover"
            />
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Ihsanul Hak IK
          </h1>

          <p className="text-xl text-gray-300">
            Backend Software Engineer
          </p>

          <p className="mt-3 text-gray-400">
            APIs • Distributed Systems • Real-Time Applications • Rust
          </p>

        </motion.div>

        {/* Code Card */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: .8 }}
          className="rounded-xl border border-white/10 bg-black/40 p-8 font-mono text-sm mb-16"
        >

          <div className="text-cyan-400 mb-4">
            const engineer = {"{"}
          </div>

          <div className="ml-4 space-y-2">

            <div>
              <span className="text-blue-400">name:</span>{" "}
              "Ihsanul Hak IK",
            </div>

            <div>
              <span className="text-blue-400">role:</span>{" "}
              "Backend Software Engineer",
            </div>

            <div>
              <span className="text-blue-400">experience:</span>{" "}
              "1+ Years",
            </div>

            <div>
              <span className="text-blue-400">specialization:</span>{" "}
              [
                "Backend Architecture",
                "GraphQL",
                "REST APIs",
                "Real-Time Systems",
                "Authentication",
                "Payment Infrastructure"
              ],
            </div>

            <div>
              <span className="text-blue-400">currently_learning:</span>{" "}
              [
                "Rust",
                "Systems Programming",
                "Open Source Payment Infrastructure"
              ],
            </div>

            <div>
              <span className="text-blue-400">philosophy:</span>{" "}
              "{typedBio}"
            </div>

          </div>

          <div className="text-cyan-400 mt-4">{"}"}</div>

        </motion.div>

        {/* About */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .8 }}
          className="rounded-xl bg-black/40 border border-white/10 p-8 mb-16"
        >

          <h2 className="text-3xl font-bold mb-6">
            About Me
          </h2>

          <div className="space-y-5 text-gray-300 leading-8">

            <p>
              I'm a backend engineer passionate about building software that
              stays reliable under real production workloads. My work ranges
              from GraphQL APIs and enterprise platforms to authentication
              systems, deployment automation, and real-time infrastructure.
            </p>

            <p>
              Throughout my professional experience, I've taken ownership of
              complete backend systems, from database design and API
              development to Linux server deployment with Nginx, SSL, Docker,
              and production environments.
            </p>

            <p>
              Recently I've been focusing on Rust and modern payment
              orchestration, exploring high-performance systems programming,
              asynchronous architectures, and open-source infrastructure.
            </p>

            <p>
              I enjoy building software that's clean, scalable, secure, and
              maintainable rather than simply making things work.
            </p>

          </div>

        </motion.div>

        {/* Highlights */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .8 }}
          className="grid md:grid-cols-2 gap-6 mb-16"
        >

          {[
            {
              title: "Backend Engineering",
              desc: "Node.js, NestJS, Express, GraphQL, REST APIs"
            },
            {
              title: "Real-Time Systems",
              desc: "Redis Pub/Sub, WebSockets, Authentication, Sessions"
            },
            {
              title: "Infrastructure",
              desc: "Linux, Docker, Nginx, SSL, VPS Deployment"
            },
            {
              title: "Current Focus",
              desc: "Rust, Payment Infrastructure & Systems Programming"
            }
          ].map((item, index) => (

            <div
              key={index}
              className="rounded-xl border border-white/10 bg-black/40 p-6"
            >

              <h3 className="text-lg font-semibold text-cyan-400 mb-3">
                {item.title}
              </h3>

              <p className="text-gray-300">
                {item.desc}
              </p>

            </div>

          ))}

        </motion.div>

        {/* Resume */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="rounded-xl border border-white/10 bg-black/40 p-8 text-center mb-16"
        >

          <div className="text-4xl mb-4">
            📄
          </div>

          <h3 className="text-2xl font-bold mb-3">
            Resume
          </h3>

          <p className="text-gray-400 mb-8">
            Learn more about my professional experience, projects, and technical skills.
          </p>

          <div className="flex flex-wrap justify-center gap-4">

            <a
              href="/files/ihsan_ik.pdf"
              download
              className="px-6 py-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 transition"
            >
              Download Resume
            </a>

            <a
              href="/files/ihsan_ik.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg border border-white/20 hover:bg-white/10 transition"
            >
              View Resume
            </a>

          </div>

        </motion.div>

        {/* CTA */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center"
        >

          <p className="text-gray-400 mb-5">
            Interested in building something together?
          </p>

          <a
            href="/contact"
            className="inline-block px-8 py-3 rounded-lg border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 transition"
          >
            Let's Connect
          </a>

        </motion.div>

      </div>
    </section>
  )
}