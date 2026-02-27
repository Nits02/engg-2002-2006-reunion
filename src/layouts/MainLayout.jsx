import { useState, useRef, useEffect } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import Hero from '../components/Hero'
import { useAuth } from '../contexts/AuthContext'

function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)
  const { user, loading, signInWithGoogle, signOut, displayName, avatarUrl } = useAuth()
  const location = useLocation()
  const isHome = location.pathname === '/' || location.pathname === ''

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

              {/* Auth: Login / User Profile */}
              {!loading && (
                user ? (
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 pl-1 pr-3 py-1 transition-colors"
                    >
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="w-7 h-7 rounded-full bg-accent-500 flex items-center justify-center text-xs font-bold text-primary-900">
                          {displayName.charAt(0).toUpperCase()}
                        </span>
                      )}
                      <span className="text-sm font-medium text-white truncate max-w-[120px]">{displayName}</span>
                      <svg className={`w-4 h-4 text-white/60 transition-transform ${profileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {profileOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <button
                          onClick={() => { signOut(); setProfileOpen(false) }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={signInWithGoogle}
                    className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 font-medium text-sm px-4 py-2 rounded-full shadow-sm transition-all duration-200 hover:shadow-md"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Sign in with Google
                  </button>
                )
              )}
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

              {/* Mobile Auth */}
              {!loading && (
                user ? (
                  <div className="border-t border-white/10 mt-2 pt-3">
                    <div className="flex items-center gap-3 px-3 py-2">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center text-sm font-bold text-primary-900">
                          {displayName.charAt(0).toUpperCase()}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{displayName}</p>
                        <p className="text-xs text-white/50 truncate">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { signOut(); setMobileOpen(false) }}
                      className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-white/5 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { signInWithGoogle(); setMobileOpen(false) }}
                    className="flex items-center gap-2 mx-3 mt-2 bg-white hover:bg-gray-100 text-gray-700 font-medium text-sm px-4 py-2.5 rounded-lg shadow-sm transition-all w-[calc(100%-1.5rem)]"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Sign in with Google
                  </button>
                )
              )}
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
