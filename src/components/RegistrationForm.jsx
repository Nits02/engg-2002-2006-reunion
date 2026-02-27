import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { generateReferralCode } from '../utils/generateReferralCode'

/* ── Branch options ────────────────────────────────────── */
const BRANCHES = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Biotechnology',
]

/* ── Initial form state ────────────────────────────────── */
const INITIAL_FORM = {
  full_name: '',
  email: '',
  phone: '',
  branch: '',
  city: '',
  country: '',
  referral_code_used: '',
}

const INITIAL_ERRORS = {}

/* ── Field config (keeps JSX lean) ─────────────────────── */
const FIELD_DEFS = [
  { name: 'full_name', label: 'Full Name', type: 'text', placeholder: 'Your full name', half: true, required: true },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', half: true, required: true },
  { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+91 98765 43210', half: true, required: true },
  { name: 'branch', label: 'Branch', type: 'select', placeholder: 'Select your branch', half: true, required: true },
  { name: 'city', label: 'City', type: 'text', placeholder: 'e.g. Bangalore', half: true, required: true },
  { name: 'country', label: 'Country', type: 'text', placeholder: 'e.g. India', half: true, required: true },
  { name: 'referral_code_used', label: 'Referral Code (optional)', type: 'text', placeholder: 'e.g. ABC-7HK92M', half: false, required: false },
]

/* ── Validation ────────────────────────────────────────── */
function validate(form) {
  const errors = {}

  if (!form.full_name.trim()) errors.full_name = 'Full name is required.'
  else if (form.full_name.trim().length < 2) errors.full_name = 'Name must be at least 2 characters.'

  if (!form.email.trim()) errors.email = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address.'

  if (!form.phone.trim()) errors.phone = 'Phone number is required.'
  else if (!/^[+\d][\d\s\-()]{6,18}$/.test(form.phone.trim())) errors.phone = 'Enter a valid phone number.'

  if (!form.branch) errors.branch = 'Please select a branch.'

  if (!form.city.trim()) errors.city = 'City is required.'
  if (!form.country.trim()) errors.country = 'Country is required.'

  return errors
}

/* ── Inline error component ────────────────────────────── */
function FieldError({ message }) {
  if (!message) return null
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-1 text-xs text-red-500"
    >
      {message}
    </motion.p>
  )
}

/* ── Success banner ────────────────────────────────────── */
function SuccessBanner({ referralCode, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-2xl mx-auto px-4 py-16 text-center"
    >
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-10 shadow-lg">
        <span className="text-5xl mb-4 block">🎉</span>
        <h2 className="text-2xl font-bold text-primary-700 mb-2">You&rsquo;re Registered!</h2>
        <p className="text-primary-600 mb-6">We&rsquo;ll be in touch with more details soon.</p>

        <div className="inline-block bg-white border border-green-200 rounded-xl px-6 py-4 mb-6">
          <p className="text-xs uppercase tracking-wider text-primary-400 mb-1">Your Referral Code</p>
          <p className="text-2xl font-mono font-bold text-primary-700 tracking-widest select-all">{referralCode}</p>
          <p className="text-xs text-primary-400 mt-1">Share this with friends to invite them!</p>
        </div>

        <div>
          <button
            onClick={onReset}
            className="text-sm text-primary-500 hover:text-primary-700 underline underline-offset-4 transition"
          >
            Register another person
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════════
   RegistrationForm — main component
   ══════════════════════════════════════════════════════════ */
export default function RegistrationForm() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState(INITIAL_ERRORS)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [success, setSuccess] = useState(false)
  const [referralCode, setReferralCode] = useState('')

  /* ── Handlers ─────────────────────────────────────────── */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // Clear field error on edit
    setErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
    setSubmitError('')
  }, [])

  const handleReset = useCallback(() => {
    setForm(INITIAL_FORM)
    setErrors(INITIAL_ERRORS)
    setSubmitError('')
    setSuccess(false)
    setReferralCode('')
  }, [])

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()

      // Client-side validation
      const validationErrors = validate(form)
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return
      }

      setSubmitting(true)
      setSubmitError('')

      try {
        const code = await generateReferralCode()

        const { error } = await supabase.from('registrations').insert([
          {
            full_name: form.full_name.trim(),
            email: form.email.trim().toLowerCase(),
            phone: form.phone.trim(),
            branch: form.branch,
            city: form.city.trim(),
            country: form.country.trim(),
            referral_code: code,
            referral_code_used: form.referral_code_used.trim() || null,
          },
        ])

        if (error) {
          if (error.code === '23505') {
            setSubmitError('This email is already registered.')
          } else {
            setSubmitError(error.message || 'Something went wrong. Please try again.')
          }
          return
        }

        setReferralCode(code)
        setSuccess(true)
      } catch (err) {
        setSubmitError(err?.message || 'Network error. Please try again.')
      } finally {
        setSubmitting(false)
      }
    },
    [form],
  )

  /* ── Render ───────────────────────────────────────────── */
  if (success) {
    return <SuccessBanner referralCode={referralCode} onReset={handleReset} />
  }

  const inputBase =
    'w-full px-4 py-2.5 rounded-lg border outline-none transition duration-200 bg-white text-primary-800 placeholder:text-gray-400'
  const inputNormal = `${inputBase} border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500`
  const inputError = `${inputBase} border-red-400 focus:ring-2 focus:ring-red-400 focus:border-red-400`

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-primary-700 mb-3">Register for the Reunion</h1>
        <p className="text-primary-500">Fill in your details and join us for a memorable event.</p>
      </motion.div>

      {/* Form card */}
      <motion.form
        onSubmit={handleSubmit}
        noValidate
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="bg-white shadow-xl rounded-2xl p-6 sm:p-10 space-y-6 border border-gray-100"
      >
        {/* Grid fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
          {FIELD_DEFS.map((field) => {
            if (!field.half) return null // render full-width fields below
            const hasError = !!errors[field.name]

            return (
              <div key={field.name}>
                <label htmlFor={field.name} className="block text-sm font-medium text-primary-700 mb-1.5">
                  {field.label}
                </label>

                {field.type === 'select' ? (
                  <select
                    id={field.name}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    className={hasError ? inputError : inputNormal}
                  >
                    <option value="">{field.placeholder}</option>
                    {BRANCHES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className={hasError ? inputError : inputNormal}
                  />
                )}

                <AnimatePresence>
                  {hasError && <FieldError message={errors[field.name]} />}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {/* Full-width fields */}
        {FIELD_DEFS.filter((f) => !f.half).map((field) => {
          const hasError = !!errors[field.name]
          return (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-primary-700 mb-1.5">
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className={hasError ? inputError : inputNormal}
              />
              <AnimatePresence>
                {hasError && <FieldError message={errors[field.name]} />}
              </AnimatePresence>
            </div>
          )
        })}

        {/* Submit error */}
        <AnimatePresence>
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 text-center"
            >
              {submitError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-accent-500 hover:bg-accent-600 disabled:opacity-60 disabled:cursor-not-allowed text-primary-900 font-semibold py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Submitting…
            </>
          ) : (
            'Register Now'
          )}
        </button>
      </motion.form>
    </div>
  )
}
