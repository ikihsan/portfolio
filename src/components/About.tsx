import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Github, Instagram, Mail, Download } from 'lucide-react'

const About: React.FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

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

  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/ikihsan',
      icon: Github,
      color: 'hover:text-gray-300'
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/ikihsaan/',
      icon: Instagram,
      color: 'hover:text-pink-400'
    },
    {
      name: 'Email',
      url: 'mailto:ikihsaan@gmail.com',
      icon: Mail,
      color: 'hover:text-primary-400'
    }
  ]

  return (
    <section id="about" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Profile Section */}
          <motion.div variants={itemVariants} className="relative">
            <div className="relative">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-2xl blur-xl opacity-20 animate-pulse" />
              
              {/* Profile card */}
              <div className="relative glass-effect rounded-2xl p-8 border border-white/10">
                <div className="flex flex-col items-center text-center">
                  {/* Avatar */}
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="relative mb-6"
                  >
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary-500 to-cyan-500 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                      IH
                    </div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-cyan-500 animate-ping opacity-20" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">Ihsanul Hak IK</h3>
                  <p className="text-primary-400 font-medium mb-4">Backend Developer</p>
                  
                  {/* Social Links */}
                  <div className="flex space-x-4 mb-6">
                    {socialLinks.map((link) => {
                      const IconComponent = link.icon
                      return (
                        <motion.a
                          key={link.name}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.2, y: -2 }}
                          whileTap={{ scale: 0.9 }}
                          className={`p-3 glass-effect rounded-lg text-gray-400 ${link.color} transition-colors duration-200`}
                        >
                          <IconComponent size={20} />
                        </motion.a>
                      )
                    })}
                  </div>
                  
                  {/* Download CV Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-lg text-white font-medium hover:shadow-lg transition-all duration-200"
                  >
                    <Download size={18} />
                    <span>Download CV</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div>
              <motion.h2
                variants={itemVariants}
                className="text-4xl md:text-5xl font-bold text-gradient elegant-glow mb-4"
              >
                About Me
              </motion.h2>
              <motion.div
                variants={itemVariants}
                className="w-20 h-1 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full"
              />
            </div>
            
            <motion.div variants={itemVariants} className="space-y-4 text-gray-300 text-lg leading-relaxed">
              <p>
                I am a <span className="text-primary-400 font-semibold">dedicated Backend Developer</span> and 
                Software Engineer with a passion for creating robust, scalable server-side applications. 
                My expertise lies in modern JavaScript/TypeScript ecosystems, particularly with Node.js and NestJS frameworks.
              </p>
              
              <p>
                I specialize in building efficient database systems using <span className="text-cyan-400 font-semibold">Prisma ORM</span> and 
                PostgreSQL, while also implementing GraphQL and REST APIs. My approach combines technical excellence 
                with clean code principles to deliver maintainable and high-performance solutions.
              </p>
              
              <p>
                Recently, I've been working on innovative projects including an 
                <span className="text-primary-400 font-semibold"> AI-powered Forex trading platform</span> that demonstrates 
                my ability to integrate cutting-edge technologies with practical business solutions.
              </p>
            </motion.div>
            
            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-6 pt-8"
            >
              {[
                { number: '3+', label: 'Years Experience' },
                { number: '10+', label: 'Projects Completed' },
                { number: '100%', label: 'Client Satisfaction' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 glass-effect rounded-lg"
                >
                  <div className="text-2xl font-bold text-primary-400">{stat.number}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
