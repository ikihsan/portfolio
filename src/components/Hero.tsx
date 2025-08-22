import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Code, Database, Server } from 'lucide-react'

const Hero: React.FC = () => {
  const [text, setText] = useState('')
  const fullText = "Backend Developer & Software Engineer"
  
  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      setText(fullText.slice(0, i))
      i++
      if (i > fullText.length) {
        clearInterval(timer)
      }
    }, 100)
    
    return () => clearInterval(timer)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  const floatingElements = [
    { icon: Code, delay: 0, position: 'top-20 left-20' },
    { icon: Database, delay: 1, position: 'top-40 right-20' },
    { icon: Server, delay: 2, position: 'bottom-40 left-40' },
  ]

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {floatingElements.map((element, index) => {
          const IconComponent = element.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0.3, 0],
                scale: [0, 1, 0],
                rotate: 360
              }}
              transition={{
                duration: 4,
                delay: element.delay,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className={`absolute ${element.position} text-primary-500/20`}
            >
              <IconComponent size={60} />
            </motion.div>
          )
        })}
      </div>

      {/* Main content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-4 text-center relative z-10"
      >
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <span className="text-primary-400 text-lg font-medium">Hello, I'm</span>
        </motion.div>
        
        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-8xl font-bold mb-6"
        >
          <span className="text-gradient elegant-glow">Ihsanul Hak</span>
        </motion.h1>
        
        <motion.div
          variants={itemVariants}
          className="text-2xl md:text-3xl text-gray-300 mb-8 h-12"
        >
          <span className="typewriter font-mono">{text}</span>
          <span className="animate-pulse">|</span>
        </motion.div>
        
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Passionate about building robust, scalable server-side applications with modern technologies. 
          I create innovative solutions that power the digital world, including AI-driven platforms like my 
          <span className="text-primary-400 font-semibold"> ForexAI trading system</span> hosted at 
          <span className="text-cyan-400"> forexai.coms.codes</span>.
        </motion.p>
        
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
        >
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full text-white font-semibold text-lg shadow-lg glow-primary hover:shadow-primary-500/40 transition-all duration-300"
          >
            <span className="relative z-10">View My Work</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-cyan-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.a>
          
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 border-2 border-primary-500 rounded-full text-primary-400 font-semibold text-lg hover:bg-primary-500 hover:text-white transition-all duration-300"
          >
            Get In Touch
          </motion.a>
        </motion.div>
        
        <motion.div
          variants={itemVariants}
          className="flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="cursor-pointer"
          >
            <ArrowDown className="text-primary-400" size={32} />
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-900/50 to-dark-900 pointer-events-none" />
    </section>
  )
}

export default Hero
