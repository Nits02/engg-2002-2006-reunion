import { useState } from 'react'

function Register() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-10">
          <span className="text-5xl mb-4 block">🎉</span>
          <h2 className="text-2xl font-bold text-primary-700 mb-2">You're Registered!</h2>
          <p className="text-primary-600">We'll be in touch with more details soon.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary-700 mb-3">Register for the Reunion</h1>
        <p className="text-primary-500">Fill in your details and join us for a memorable event.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-6 sm:p-10 space-y-6 border border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1.5">Full Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1.5">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-700 mb-1.5">Batch Year</label>
          <select className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition">
            <option>2002 – 2006</option>
            <option>2001 – 2005</option>
            <option>2003 – 2007</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-700 mb-1.5">Message (optional)</label>
          <textarea
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition resize-none"
            placeholder="Anything you'd like to share..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-accent-500 hover:bg-accent-600 text-primary-900 font-semibold py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
        >
          Register Now
        </button>
      </form>
    </div>
  )
}

export default Register
