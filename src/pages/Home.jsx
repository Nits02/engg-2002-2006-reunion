import { NavLink } from 'react-router-dom'
import LiveStats from '../components/LiveStats'

function Home() {
  const highlights = [
    { icon: '🤝', title: 'Reconnect', text: 'Find and reconnect with your batchmates from across the globe.' },
    { icon: '📸', title: 'Memories', text: 'Share photos, stories, and relive the best moments of college life.' },
    { icon: '🎉', title: 'Celebrate', text: 'Join us for a grand reunion event planned just for our batch.' },
  ]

  return (
    <div>
      {/* Highlights Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-700 mb-3">Why Join the Reunion?</h2>
          <p className="text-primary-500 max-w-xl mx-auto">It's more than an event — it's a homecoming.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <span className="text-4xl mb-4 block">{item.icon}</span>
              <h3 className="text-xl font-bold text-primary-700 mb-2">{item.title}</h3>
              <p className="text-primary-500 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live Stats */}
      <LiveStats />

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-500 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Be Part of It?</h2>
          <p className="text-primary-200 mb-8">Register today and secure your spot at the reunion.</p>
          <NavLink
            to="/register"
            className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-primary-900 font-semibold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Register Now
          </NavLink>
        </div>
      </section>
    </div>
  )
}

export default Home
