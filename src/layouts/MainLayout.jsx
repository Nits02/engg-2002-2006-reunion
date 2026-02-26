import { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import Hero from '../components/Hero'

function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/' || location.pathname === ''

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/register', label: 'Register' },
    { to: '/dashboard', label: 'Dashboard' },
  ]

  const linkClass = ({ isActive }) =>
    `relative px-1 py-2 text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'text-accent-400'
        : 'text-white/80 hover:text-white'
    }`

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Navigation ────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 shadow-lg backdrop-blur-sm bg-opacity-95">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2 group">
              <span className="text-2xl">🎓</span>
              <span className="text-lg font-bold text-white tracking-tight group-hover:text-accent-300 transition-colors">
                ENGG Reunion
              </span>
            </NavLink>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-white/80 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile dropdown */}
          {mobileOpen && (
            <div className="md:hidden pb-4 space-y-1 border-t border-white/10 pt-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-white/10 text-accent-400'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          )}
        </nav>
      </header>

      {/* ── Hero Section (Home only) ──────────────────── */}
      {isHome && <Hero />}

      {/* ── Page Content ──────────────────────────────── */}
      <main id="content" className={`flex-1 ${!isHome ? 'pt-16' : ''}`}>
        <Outlet />
      </main>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 text-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🎓</span>
                <span className="text-lg font-bold text-white">ENGG Reunion</span>
              </div>
              <p className="text-sm leading-relaxed">
                Bringing the ENGG batch of 2002–2006 back together.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink to={link.to} className="hover:text-accent-400 transition-colors">
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Get in Touch</h4>
              <p className="text-sm">Have questions about the reunion?</p>
              <a href="mailto:reunion@engg2006.com" className="text-accent-400 hover:text-accent-300 text-sm transition-colors">
                reunion@engg2006.com
              </a>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 text-center text-xs">
            &copy; {new Date().getFullYear()} ENGG 2002–2006 Reunion. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout
