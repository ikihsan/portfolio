// Admin note: Edit content in this file to customize the Contact page.
"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Contact() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState(['Welcome to Contact Debug Console. Required fields: name, email, message. Type "help" for commands.'])
  const [contactData, setContactData] = useState({ name: '', email: '', message: '', subject: '', method: '', skill: '' })
  const [isSending, setIsSending] = useState(false)

  const handleCommand = (cmd) => {
    const command = cmd.trim().toLowerCase()
    let response = ''

    if (command.startsWith('set ')) {
      const parts = command.split(' ')
      const field = parts[1]
      const value = parts.slice(2).join(' ').trim()
      if (field === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          response = 'Invalid email format. Please enter a valid email.'
          return
        }
      }
      if (['name', 'email', 'message', 'subject', 'method', 'skill'].includes(field)) {
        setContactData(prev => ({ ...prev, [field]: value }))
        response = `${field} set to: ${value}`
      } else {
        response = 'Invalid field. Use: name, email, message, subject, method, skill'
      }
    } else if (command === 'help') {
      response = 'Commands: set [field] [value] (required: name, email, message), send, clear, help'
    } else if (command === 'clear') {
      setOutput(['Console cleared.'])
      return
    } else if (command === 'send') {
      if (!contactData.name || !contactData.email || !contactData.message) {
        response = 'Error: Required fields missing (name, email, message).'
      } else if (isSending) {
        response = 'Already sending a message. Please wait.'
      } else {
        setIsSending(true)
        const data = new URLSearchParams()
        data.append('entry.2005620554', contactData.name)
        data.append('entry.1045781291', contactData.email)
        data.append('entry.472203668', contactData.message)
        
        fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: contactData.name,
            email: contactData.email,
            message: contactData.message
          })
        }).then(() => {
          console.log('Form submitted successfully with data:', contactData)
          setOutput(prev => [...prev, 'Message sent successfully! Hash: ' + Math.random().toString(36).substr(2, 9)])
          setContactData({ name: '', email: '', message: '', subject: '', method: '', skill: '' })
          setIsSending(false)
        }).catch((error) => {
          console.log('Error submitting form:', error)
          setOutput(prev => [...prev, 'Error sending message. Please try again.'])
          setIsSending(false)
        })
        response = 'Sending message...'
      }
    } else {
      response = 'Unknown command. Type "help".'
    }

    setOutput(prev => [...prev, `$ ${cmd}`, response])
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleCommand(input)
    }
  }

  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center px-6 pt-20">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-6xl font-bold text-center text-white mb-8"
      >
        Contact Debug Console
      </motion.h1>

      <div className="w-full max-w-4xl">
        <div className="bg-black/40 border border-white/6 rounded-lg p-6 font-mono text-sm">
          <div className="text-gray-300 mb-4 h-64 overflow-y-auto">
            {output.map((line, i) => (
              <div key={i} className={line.startsWith('$') ? 'text-neon' : 'text-gray-200'}>
                {line}
              </div>
            ))}
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent outline-none text-white font-mono text-xs resize-none border-t border-white/10 pt-2"
            placeholder="Type a command..."
            rows={2}
          />
          {isSending && <div className="mt-2 text-gray-300">Sending...</div>}
        </div>

        {/* Social Links */}
        <div className="mt-12 flex justify-center gap-6">
          <a href="https://linkedin.com/in/ikihsan" className="text-neon hover:text-white transition">LinkedIn</a>
          <a href="https://github.com/ikihsan" className="text-neon hover:text-white transition">GitHub</a>
          <a href="mailto:ikihsaan@gmail.com" className="text-neon hover:text-white transition">Email</a>
        </div>
      </div>
    </section>
  )
}