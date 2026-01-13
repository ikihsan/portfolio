// Admin note: Edit content in this file to customize the Work / Portfolio page.
"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
const projects = [
  {
    id: 1,
    title: 'CozyWood',
    description: 'A premium handcrafted furniture e-commerce platform. Features shop browsing, custom orders, user authentication, and a beautiful UI showcasing sustainable wood furniture.',
    tech: ['Next.js', 'React', 'Firebase Auth', 'Firebase Backend', 'Tailwind CSS'],
    live: 'https://cozywood.co.in',
    image: '/proj4.png',
    features: ['User Authentication', 'Custom Orders', 'Shop & Categories', 'Responsive Design']
  },
    {
    id: 2,
    title: 'TripInsta',
    description: 'A fully customizable admin-managed Tours, Packages & Resort management platform. Admins can add packages, resorts, track enquiries, monitor visitor analytics, and manage bookings seamlessly.',
    tech: ['Next.js', 'Convex (BaaS)', 'Cloudinary'],
    live: 'https://tripinsta.in',
    image: '/proj3.png',
    features: ['Admin Dashboard', 'Package & Resort Management', 'Enquiry Tracking', 'Visitor Analytics']
  },
  
  {
    id: 3,
    title: 'Secure Terminal - Private ChatApp',
    description: 'A highly private chat app with end-to-end encryption. Messages are secure, media is temporarily stored, and connections require mutual handshake. Built for ultimate privacy.',
    tech: ['Next.js', 'Convex (BaaS)', 'End-to-End Encryption'],
    live: 'https://chat.ikihsan.tech',
    github: 'https://github.com/ikihsan/SecureTerminal-PrivateChatApp.git',
    image: '/proj1.png',
    features: ['E2E Encrypted', 'Mutual Handshake', 'Temporary Media Storage']
  },
  
  {
    id: 4,
    title: 'AI Mock Interview Web App',
    description: 'Prepare for interviews with AI-powered mock sessions. Customize by tech stack, experience level, and topics. Get personalized feedback and practice.',
    tech: ['Next.js', 'Node.js', 'Express', 'MongoDB', 'Gemini API'],
    github: 'https://github.com/ikihsan/Mock_interview.git',
    image: '/proj2.png',
    features: ['Customizable Topics', 'AI Feedback', 'Tech Stack Focus']
  },
  {
    id: 5,
    title: 'IKIHSAN - Digital Architect',
    description: 'My personalized tech portfolio featuring an interactive orbital navigation system. A space-themed interface showcasing projects as orbiting nodes with dynamic animations.',
    tech: ['Next.js', 'React', 'Framer Motion', 'CSS Animations'],
    live: 'https://ikihsan.tech',
    image: '/proj5.png',
    features: ['Interactive Orbital UI', 'Project Showcase', 'Dynamic Animations', 'Mood Updates']
  },

]

export default function Work() {
  const [selectedProject, setSelectedProject] = useState(null)

  return (
    <section className="min-h-screen px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold text-center mb-12"
        >
          Deployed Projects
        </motion.h1>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="bg-black/40 border border-white/10 rounded-lg overflow-hidden hover:border-neon/50 transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors" />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-300 mb-4">{project.description}</p>

                <div className="mb-4">
                  <div className="text-sm text-neon/80 mb-2">Tech Stack:</div>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, idx) => (
                      <span key={idx} className="px-2 py-1 bg-neon/10 text-neon text-xs rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-neon/80 mb-2">Key Features:</div>
                  <ul className="text-sm text-gray-400 space-y-1">
                    {project.features.map((feature, idx) => (
                      <li key={idx}>• {feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3">
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-neon/10 text-neon border border-neon/20 rounded hover:bg-neon/20 transition"
                    >
                      Launch App
                    </a>
                  )}
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white/10 text-white border border-white/20 rounded hover:bg-white/20 transition"
                  >
                    View Code
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-gray-400 mb-4">More projects? Backend dev here—static sites are boring. Algorithms &gt; Aesthetics. 😉</p>
          <a href="/contact" className="inline-block px-6 py-3 bg-neon/10 text-neon border border-neon/20 rounded hover:bg-neon/20 transition">
            Collaborate on Ideas
          </a>
        </motion.div>
      </div>
    </section>
  )
}