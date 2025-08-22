import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Mail, Github, Instagram, MapPin, Phone, Send } from 'lucide-react'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

const Contact: React.FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Create mailto link
      const subject = encodeURIComponent(data.subject || `Portfolio Contact from ${data.name}`)
      const body = encodeURIComponent(
        `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`
      )
      const mailtoLink = `mailto:ikihsaan@gmail.com?subject=${subject}&body=${body}`
      
      // Open email client
      window.open(mailtoLink)
      
      toast.success('Email client opened! Thank you for reaching out.')
      reset()
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'ikihsaan@gmail.com',
      href: 'mailto:ikihsaan@gmail.com',
      color: 'hover:text-primary-400'
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'github.com/ikihsan',
      href: 'https://github.com/ikihsan',
      color: 'hover:text-gray-300'
    },
    {
      icon: Instagram,
      label: 'Instagram',
      value: '@ikihsaan',
      href: 'https://www.instagram.com/ikihsaan/',
      color: 'hover:text-pink-400'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'India',
      color: 'hover:text-green-400'
    }
  ]

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

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient elegant-glow mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Ready to collaborate on your next project? Let's build something amazing together.
            </p>
            <motion.div
              variants={itemVariants}
              className="w-20 h-1 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full mx-auto mt-4"
            />
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Let's Connect</h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  I'm always interested in discussing new opportunities, innovative projects, 
                  and potential collaborations. Whether you have a specific project in mind 
                  or just want to chat about technology, feel free to reach out!
                </p>
              </div>

              {/* Contact Methods */}
              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={inView ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                      className="group"
                    >
                      {info.href ? (
                        <a
                          href={info.href}
                          target={info.href.startsWith('http') ? '_blank' : undefined}
                          rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className={`flex items-center space-x-4 p-4 glass-effect rounded-lg hover:border-white/20 transition-all duration-300 ${info.color}`}
                        >
                          <div className="flex-shrink-0">
                            <IconComponent size={24} />
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">{info.label}</div>
                            <div className="text-white font-medium">{info.value}</div>
                          </div>
                        </a>
                      ) : (
                        <div className={`flex items-center space-x-4 p-4 glass-effect rounded-lg ${info.color}`}>
                          <div className="flex-shrink-0">
                            <IconComponent size={24} />
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">{info.label}</div>
                            <div className="text-white font-medium">{info.value}</div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* Quick Stats */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 gap-4 pt-8"
              >
                <div className="text-center p-4 glass-effect rounded-lg">
                  <div className="text-2xl font-bold text-primary-400">24h</div>
                  <div className="text-sm text-gray-400">Response Time</div>
                </div>
                <div className="text-center p-4 glass-effect rounded-lg">
                  <div className="text-2xl font-bold text-cyan-400">100%</div>
                  <div className="text-sm text-gray-400">Project Success</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...register('name', { required: 'Name is required' })}
                      className="w-full px-4 py-3 glass-effect rounded-lg border border-white/10 focus:border-primary-400 focus:outline-none text-white placeholder-gray-400 transition-all duration-200"
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Please enter a valid email address'
                        }
                      })}
                      className="w-full px-4 py-3 glass-effect rounded-lg border border-white/10 focus:border-primary-400 focus:outline-none text-white placeholder-gray-400 transition-all duration-200"
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    {...register('subject')}
                    className="w-full px-4 py-3 glass-effect rounded-lg border border-white/10 focus:border-primary-400 focus:outline-none text-white placeholder-gray-400 transition-all duration-200"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    {...register('message', { required: 'Message is required' })}
                    className="w-full px-4 py-3 glass-effect rounded-lg border border-white/10 focus:border-primary-400 focus:outline-none text-white placeholder-gray-400 resize-none transition-all duration-200"
                    placeholder="Tell me about your project..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-lg text-white font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Send size={20} />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </motion.button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact
