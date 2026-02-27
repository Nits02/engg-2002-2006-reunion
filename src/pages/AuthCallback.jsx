import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

/**
 * Handles the OAuth redirect callback.
 * Supabase appends the auth tokens as URL hash fragments.
 * This page waits for the session to be established, then redirects home.
 */
function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    // supabase-js automatically picks up the hash fragment and sets the session.
    // We just need to wait for it to finish, then redirect.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        navigate('/', { replace: true })
      }
    })

    // Fallback: if the session is already set (e.g., page refresh), redirect immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/', { replace: true })
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-primary-700 font-medium">Signing you in…</p>
      </div>
    </div>
  )
}

export default AuthCallback
