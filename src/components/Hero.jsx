import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'

/* ── Floating Particle ─────────────────────────────────── */
function Particle({ size, x, y, duration, delay }) {
  return (
    <motion.div
      className="absolute rounded-full bg-white/10"
      style={{ width: size, height: size, left: `${x}%`, top: `${y}%` }}
      animate={{
        y: [0, -30, 10, -20, 0],
        x: [0, 15, -10, 5, 0],
        opacity: [0, 0.6, 0.3, 0.7, 0],
        scale: [0.8, 1.2, 1, 1.1, 0.8],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

/* ── Hero Section ──────────────────────────────────────── */
function Hero() {
  // Generate deterministic particles
  const particles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      size: 4 + (i % 5) * 4,
      x: (i * 17 + 7) % 100,
      y: (i * 23 + 11) % 100,
      duration: 6 + (i % 4) * 2,
      delay: (i * 0.4) % 5,
    })),
  [])

  /* Stagger container */
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.18, delayChildren: 0.3 } },
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  }

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.85 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <section className="hero-gradient relative pt-16 min-h-[100dvh] flex items-center overflow-hidden">
      {/* Animated gradient background handled via CSS class "hero-gradient" */}

      {/* Radial glow overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06)_0%,transparent_70%)]" />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {particles.map((p) => (
          <Particle key={p.id} {...p} />
        ))}
      </div>

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 sm:py-28 lg:py-32"
      >
        {/* Badge */}
        <motion.div variants={scaleIn} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8">
          <span className="text-lg">🎓</span>
          <span className="text-sm font-medium text-white/90 tracking-wide uppercase">
            Engineering Batch 2002–2006
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={fadeUp}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6"
        >
          20 Years Later…
          <br />
          <span className="bg-gradient-to-r from-accent-300 via-accent-400 to-accent-500 bg-clip-text text-transparent">
            Shall We Meet Again?
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          className="max-w-2xl mx-auto text-lg sm:text-xl text-primary-200/90 mb-12 leading-relaxed"
        >
          Two decades of memories, friendships, and shared dreams.
          It's time to reconnect, relive, and celebrate the journey.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NavLink
            to="/register"
            className="group relative inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-400 text-primary-900 font-bold px-10 py-4 rounded-full shadow-[0_8px_32px_rgba(250,176,5,0.35)] hover:shadow-[0_12px_40px_rgba(250,176,5,0.5)] transition-all duration-300 transform hover:-translate-y-1"
          >
            Register Now
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </NavLink>

          <a
            href="#content"
            className="inline-flex items-center gap-2 border-2 border-white/25 hover:border-white/50 text-white font-semibold px-8 py-4 rounded-full backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
          >
            Learn More
            <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={fadeUp}
          className="mt-16 sm:mt-20"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex flex-col items-center gap-2 text-white/40"
          >
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <div className="w-5 h-8 rounded-full border-2 border-white/20 flex justify-center pt-1.5">
              <motion.div
                animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1 h-1 rounded-full bg-white/60"
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Curved bottom edge */}
      <div className="absolute bottom-0 inset-x-0 z-10">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
          <path d="M0 100h1440V40C1200 80 960 10 720 40S240 80 0 40v60z" fill="#fafbfd" />
        </svg>
      </div>
    </section>
  )
}

export default Hero
