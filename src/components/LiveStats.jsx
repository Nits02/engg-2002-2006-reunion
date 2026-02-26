import { motion } from 'framer-motion'
import useCountUp from '../hooks/useCountUp'

/* ── Mock data (replace with Supabase fetch later) ────── */
const MOCK_STATS = [
  {
    label: 'Registrations',
    value: 248,
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128H9m6 0a5.972 5.972 0 00-.786-3.07M9 19.128v-.003a9.21 9.21 0 01.786-3.07M9 19.128H3.375a4.125 4.125 0 01-.375-8.207 9.375 9.375 0 0118 0 4.125 4.125 0 01-.375 8.207M12 6.375a3.375 3.375 0 110-6.75 3.375 3.375 0 010 6.75z" />
      </svg>
    ),
    color: 'from-primary-500 to-primary-700',
    bgHover: 'group-hover:bg-primary-50',
  },
  {
    label: 'Cities',
    value: 42,
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008V7.5z" />
      </svg>
    ),
    color: 'from-accent-500 to-accent-700',
    bgHover: 'group-hover:bg-accent-50',
  },
  {
    label: 'Countries',
    value: 12,
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9 9 0 013 12c0-1.47.353-2.856.978-4.082" />
      </svg>
    ),
    color: 'from-emerald-500 to-emerald-700',
    bgHover: 'group-hover:bg-emerald-50',
  },
  {
    label: 'Volunteers',
    value: 18,
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    color: 'from-rose-500 to-rose-700',
    bgHover: 'group-hover:bg-rose-50',
  },
]

/* ── Single Stat Card ──────────────────────────────────── */
function StatCard({ label, value, icon, color, bgHover, index }) {
  const { count, ref } = useCountUp(value, 2000)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <div
        className={`relative bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 text-center
          shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden ${bgHover}`}
      >
        {/* Gradient accent bar at top */}
        <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${color}`} />

        {/* Icon */}
        <div
          className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${color}
            text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>

        {/* Number */}
        <p className="text-4xl sm:text-5xl font-extrabold text-primary-800 tabular-nums tracking-tight">
          {count.toLocaleString()}
          <span className="text-accent-500 text-3xl align-top ml-0.5">+</span>
        </p>

        {/* Label */}
        <p className="mt-2 text-sm font-medium text-primary-500 uppercase tracking-wider">
          {label}
        </p>
      </div>
    </motion.div>
  )
}

/* ── LiveStats Section ─────────────────────────────────── */
export default function LiveStats() {
  // TODO: Replace MOCK_STATS with Supabase realtime query
  // e.g. const { data } = useSupabaseStats()
  const stats = MOCK_STATS

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-primary-50 text-primary-600 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
            Live Stats
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-700 mb-3">
            Reunion at a Glance
          </h2>
          <p className="text-primary-500 max-w-xl mx-auto">
            Real-time numbers from our growing community of alumni.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} index={i} {...stat} />
          ))}
        </div>
      </div>
    </section>
  )
}
