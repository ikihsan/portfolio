import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Server, 
  Database, 
  Code, 
  Zap, 
  Cloud, 
  GitBranch,
  Layers,
  Globe,
  Terminal
} from 'lucide-react'

interface Skill {
  name: string
  category: string
  icon: React.ReactNode
  proficiency: number
  color: string
}

const Skills: React.FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const skills: Skill[] = [
    { name: 'Node.js', category: 'Runtime', icon: <Server />, proficiency: 95, color: 'from-green-400 to-green-600' },
    { name: 'NestJS', category: 'Framework', icon: <Layers />, proficiency: 90, color: 'from-red-400 to-red-600' },
    { name: 'TypeScript', category: 'Language', icon: <Code />, proficiency: 92, color: 'from-blue-400 to-blue-600' },
    { name: 'JavaScript', category: 'Language', icon: <Zap />, proficiency: 95, color: 'from-yellow-400 to-yellow-600' },
    { name: 'Prisma', category: 'ORM', icon: <Database />, proficiency: 88, color: 'from-purple-400 to-purple-600' },
    { name: 'PostgreSQL', category: 'Database', icon: <Database />, proficiency: 85, color: 'from-indigo-400 to-indigo-600' },
    { name: 'MongoDB', category: 'Database', icon: <Database />, proficiency: 82, color: 'from-green-400 to-green-600' },
    { name: 'GraphQL', category: 'API', icon: <Globe />, proficiency: 80, color: 'from-pink-400 to-pink-600' },
    { name: 'REST APIs', category: 'API', icon: <Globe />, proficiency: 93, color: 'from-cyan-400 to-cyan-600' },
    { name: 'Docker', category: 'DevOps', icon: <Cloud />, proficiency: 78, color: 'from-blue-400 to-blue-600' },
    { name: 'Git', category: 'Version Control', icon: <GitBranch />, proficiency: 90, color: 'from-orange-400 to-orange-600' },
    { name: 'Express.js', category: 'Framework', icon: <Terminal />, proficiency: 92, color: 'from-gray-400 to-gray-600' },
  ]

  const categories = [...new Set(skills.map(skill => skill.category))]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
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

  const SkillCard: React.FC<{ skill: Skill; index: number }> = ({ skill, index }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ 
        scale: 1.05, 
        rotateY: 10,
        z: 50
      }}
      className="group relative"
    >
      <div className="relative overflow-hidden glass-effect rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
        {/* Animated background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
        
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : { scale: 0 }}
          transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
          className={`text-4xl mb-4 bg-gradient-to-r ${skill.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}
        >
          {skill.icon}
        </motion.div>
        
        {/* Content */}
        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors duration-300">
          {skill.name}
        </h3>
        <p className="text-gray-400 text-sm mb-4">{skill.category}</p>
        
        {/* Proficiency Bar */}
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500">Proficiency</span>
            <span className="text-xs text-primary-400 font-semibold">{skill.proficiency}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={inView ? { width: `${skill.proficiency}%` } : { width: 0 }}
              transition={{ delay: index * 0.1 + 0.5, duration: 1, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${skill.color} rounded-full relative`}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )

  return (
    <section id="skills" className="py-20 relative">
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
              Skills & Technologies
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A comprehensive toolkit of modern technologies that I use to build robust, scalable applications
            </p>
            <motion.div
              variants={itemVariants}
              className="w-20 h-1 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full mx-auto mt-4"
            />
          </motion.div>

          {/* Skills Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {skills.map((skill, index) => (
              <SkillCard key={skill.name} skill={skill} index={index} />
            ))}
          </motion.div>

          {/* Categories Overview */}
          <motion.div variants={itemVariants} className="mt-16">
            <h3 className="text-2xl font-bold text-center text-white mb-8">Technology Categories</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category}
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: index * 0.1 + 1 }}
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-3 glass-effect rounded-full border border-white/10 hover:border-primary-400/50 transition-all duration-300"
                >
                  <span className="text-sm font-medium text-gray-300 group-hover:text-primary-400">
                    {category}
                  </span>
                  <span className="ml-2 text-xs text-primary-400">
                    {skills.filter(skill => skill.category === category).length}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Skills
