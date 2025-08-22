import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Github, ExternalLink, Star, GitFork, Eye } from 'lucide-react'

interface Project {
  id: number
  title: string
  description: string
  longDescription: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  imageUrl?: string
  featured: boolean
  stats?: {
    stars?: number
    forks?: number
    views?: number
  }
}

const Projects: React.FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const projects: Project[] = [
    {
      id: 1,
      title: 'ForexAI Trading Platform',
      description: 'Advanced AI-powered forex trading system with real-time market analysis and automated trading capabilities.',
      longDescription: 'A comprehensive forex trading platform that leverages artificial intelligence to provide real-time market analysis, predictive insights, and automated trading strategies. Built with modern backend technologies and deployed for optimal performance.',
      technologies: ['Node.js', 'NestJS', 'TypeScript', 'AI/ML', 'PostgreSQL', 'Docker', 'Redis'],
      liveUrl: 'https://forexai.coms.codes',
      imageUrl: '/projects/forexai.jpg',
      featured: true,
      stats: {
        views: 1250
      }
    },
    {
      id: 2,
      title: 'AI-based Mock Interview System',
      description: 'An intelligent mock interview platform providing real-time feedback and assessment for job preparation.',
      longDescription: 'Comprehensive interview preparation platform with AI-powered feedback system, real-time assessment capabilities, and detailed performance analytics to help candidates improve their interview skills.',
      technologies: ['Node.js', 'NestJS', 'AI Integration', 'Database Management', 'WebRTC', 'Socket.io'],
      githubUrl: 'https://github.com/ikihsan/Mock_interview',
      imageUrl: '/projects/mock-interview.jpg',
      featured: true,
      stats: {
        stars: 45,
        forks: 12
      }
    },
    {
      id: 3,
      title: 'Personal Portfolio v2',
      description: 'Modern, responsive portfolio website built with React and cutting-edge web technologies.',
      longDescription: 'A stunning personal portfolio showcasing modern web development practices with smooth animations, responsive design, and optimal performance.',
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vite'],
      githubUrl: 'https://github.com/ikihsan/portfolio',
      liveUrl: 'https://ikihsan.coms.codes',
      imageUrl: '/projects/portfolio.jpg',
      featured: false
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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -10 }}
      className={`group relative overflow-hidden rounded-2xl glass-effect border border-white/10 hover:border-white/20 transition-all duration-500 ${
        project.featured ? 'lg:col-span-2' : ''
      }`}
    >
      {/* Background Image Placeholder */}
      <div className="relative h-64 bg-gradient-to-br from-primary-500/20 to-cyan-500/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-cyan-500/10 group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl text-white/20">🚀</div>
        </div>
        
        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full text-xs font-semibold text-white">
              Featured
            </span>
          </div>
        )}
        
        {/* Project Links */}
        <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {project.githubUrl && (
            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 glass-effect rounded-lg text-white hover:text-primary-400 transition-colors duration-200"
            >
              <Github size={20} />
            </motion.a>
          )}
          {project.liveUrl && (
            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 glass-effect rounded-lg text-white hover:text-primary-400 transition-colors duration-200"
            >
              <ExternalLink size={20} />
            </motion.a>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors duration-300">
          {project.title}
        </h3>
        
        <p className="text-gray-400 mb-4 line-clamp-3">
          {project.featured ? project.longDescription : project.description}
        </p>
        
        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, techIndex) => (
            <span
              key={techIndex}
              className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300 hover:text-primary-400 hover:border-primary-400/30 transition-all duration-200"
            >
              {tech}
            </span>
          ))}
        </div>
        
        {/* Stats */}
        {project.stats && (
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {project.stats.stars && (
              <div className="flex items-center space-x-1">
                <Star size={14} />
                <span>{project.stats.stars}</span>
              </div>
            )}
            {project.stats.forks && (
              <div className="flex items-center space-x-1">
                <GitFork size={14} />
                <span>{project.stats.forks}</span>
              </div>
            )}
            {project.stats.views && (
              <div className="flex items-center space-x-1">
                <Eye size={14} />
                <span>{project.stats.views}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )

  return (
    <section id="projects" className="py-20 relative">
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
              Featured Projects
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A showcase of my latest work, featuring innovative solutions and cutting-edge technologies
            </p>
            <motion.div
              variants={itemVariants}
              className="w-20 h-1 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full mx-auto mt-4"
            />
          </motion.div>

          {/* Projects Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </motion.div>

          {/* More Projects Coming Soon */}
          <motion.div
            variants={itemVariants}
            className="mt-16 text-center"
          >
            <div className="glass-effect rounded-2xl p-8 border border-white/10">
              <div className="text-4xl mb-4">🔮</div>
              <h3 className="text-2xl font-bold text-white mb-2">More Projects Coming Soon</h3>
              <p className="text-gray-400 mb-6">
                I'm constantly working on new and exciting projects. Stay tuned for updates!
              </p>
              <motion.a
                href="https://github.com/ikihsan"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-lg text-white font-medium hover:shadow-lg transition-all duration-200"
              >
                <Github size={20} />
                <span>View All on GitHub</span>
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Projects
