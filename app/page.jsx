"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

// Home page — minimal hero with rotating roles and CTAs.
export default function Home() {
  const roles = ['Backend Developer', 'API Builder', 'Prisma / Postgres', 'Full-stack Engineer', 'DevRel Enthusiast']
  const [index, setIndex] = useState(0)
  const [terminalInput, setTerminalInput] = useState('')
  const [terminalOutput, setTerminalOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentTrivia, setCurrentTrivia] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i + 1) % roles.length), 2600)
    return () => clearInterval(t)
  }, [])

  const handleTerminalCommand = async (cmd) => {
    setCurrentTrivia(null)
    const command = cmd.trim()
    if (command.toLowerCase().startsWith('exec ')) {
      const code = command.slice(5).trim()
      setIsLoading(true)
      try {
        const response = await fetch('https://emkc.org/api/v2/piston/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            language: 'javascript',
            version: '18.15.0',
            files: [{ content: code }]
          })
        })
        const data = await response.json()
        if (data.run.code === 0) {
          setTerminalOutput(`Execution successful:\n${data.run.output}`)
        } else {
          setTerminalOutput('You have made mistakes, correct your code and try again')
        }
      } catch (error) {
        setTerminalOutput('Error executing code. Please try again.')
      }
      setIsLoading(false)
    } else if (command.toLowerCase() === 'trivia') {
      setIsLoading(true)
      try {
        const response = await fetch('https://opentdb.com/api.php?amount=1')
        const data = await response.json()
        const q = data.results[0]
        const options = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5)
        setCurrentTrivia({ question: q.question, options, answer: q.correct_answer, showAnswer: false })
        setTerminalOutput(`Trivia: ${q.question}<br>Options: ${options.join(' | ')}`)
      } catch (error) {
        setTerminalOutput('Error fetching trivia. Try again.')
      }
      setIsLoading(false)
    } else if (command.toLowerCase() === 'joke') {
      setIsLoading(true)
      try {
        const response = await fetch('https://icanhazdadjoke.com/', {
          headers: { 'Accept': 'application/json' }
        })
        const data = await response.json()
        setTerminalOutput(data.joke)
      } catch (error) {
        setTerminalOutput('Error fetching joke. Try again.')
      }
      setIsLoading(false)
    } else if (command.toLowerCase() === 'apod') {
      setIsLoading(true)
      try {
        const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
        const data = await response.json()
        setTerminalOutput(`NASA APOD: ${data.title}<br>${data.explanation}<br><br><img src="${data.url}" alt="APOD" style="max-width:100%; height:auto;" />`)
      } catch (error) {
        setTerminalOutput('Error fetching APOD. Try again.')
      }
      setIsLoading(false)
    } else {
      const cmdLower = command.toLowerCase()
      if (cmdLower === 'home') router.push('/')
      else if (cmdLower === 'about') router.push('/about')
      else if (cmdLower === 'blog') router.push('/blog')
      else if (cmdLower === 'work') router.push('/work')
      else if (cmdLower === 'contact') router.push('/contact')
      else if (cmdLower === 'linkedin') window.open('https://linkedin.com/in/ikihsan', '_blank')
      else if (cmdLower === 'github') window.open('https://github.com/ikihsan', '_blank')
      else setTerminalOutput('Unknown command')
    }
    setTerminalInput('')
  }

  const showTriviaAnswer = () => {
    if (currentTrivia) {
      setCurrentTrivia({ ...currentTrivia, showAnswer: true })
      setTerminalOutput(`Trivia: ${currentTrivia.question}<br>Options: ${currentTrivia.options.join(' | ')}<br><br>Answer: ${currentTrivia.answer}`)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleTerminalCommand(terminalInput)
    }
  }

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-6 pt-20">
      <div className="max-w-5xl w-full text-center">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight"
        >
          Ihsanul Hak IK
        </motion.h1>

        <p className="mt-6 text-xl text-gray-200 max-w-2xl mx-auto">
          Building thoughtful, maintainable software. 
          <span className="ml-2 inline-block text-neon font-medium">{roles[index]}</span>
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/work" className="px-5 py-3 rounded-md bg-neon/10 text-neon ring-1 ring-neon/20 hover:bg-neon/20">View Work</Link>
          <Link href="/contact" className="px-5 py-3 rounded-md bg-white/6 hover:bg-white/10">Contact</Link>
        </div>

        <div className="mt-16">
          <div className="mx-auto w-[400px] p-4 bg-black/40 border border-white/6 rounded-lg text-left text-sm">
            <div className="font-medium text-white/90">Live Terminal</div>
            <textarea
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="mt-2 w-full bg-transparent outline-none text-white font-mono text-xs resize-none"
              placeholder="Type your command here..."
              rows={3}
            />
            {isLoading && <div className="mt-2 text-gray-300">Executing...</div>}
            {terminalOutput && (
              <div className="mt-2 text-gray-300 font-mono text-xs" dangerouslySetInnerHTML={{ __html: terminalOutput }} />
            )}
            {currentTrivia && !currentTrivia.showAnswer && (
              <button onClick={showTriviaAnswer} className="mt-2 px-3 py-1 bg-neon/20 text-neon rounded text-xs">
                Show Answer
              </button>
            )}
            <div className="mt-4 text-gray-400 font-mono text-xs border-t border-white/10 pt-2">
              <div className="text-neon/80 mb-1">Terminal Commands:</div>
              <div>• exec [js code] → Execute JavaScript (Shift+Enter for multi-line)</div>
              <div>• trivia → Random quiz with options</div>
              <div>• joke → Fetch a dad joke</div>
              <div>• apod → NASA's Astronomy Picture of the Day</div>
              <div>• home/about/blog/work/contact → Navigate pages</div>
              <div>• linkedin/github → Open social links</div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <div className="animate-bounce text-gray-300">↓</div>
        </div>
      </div>
    </section>
  )
}