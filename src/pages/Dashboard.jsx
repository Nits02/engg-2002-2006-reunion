function Dashboard() {
  const stats = [
    { label: 'Registered', value: '142', icon: '👥' },
    { label: 'Days to Go', value: '87', icon: '📅' },
    { label: 'Cities', value: '24', icon: '🌍' },
    { label: 'Messages', value: '56', icon: '💬' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary-700 mb-2">Dashboard</h1>
        <p className="text-primary-500">A quick overview of the reunion progress.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-center hover:shadow-lg transition-shadow duration-300"
          >
            <span className="text-3xl mb-2 block">{stat.icon}</span>
            <p className="text-3xl font-bold text-primary-700">{stat.value}</p>
            <p className="text-sm text-primary-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent activity placeholder */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-primary-700 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { name: 'Rahul Sharma', action: 'registered for the reunion', time: '2 hours ago' },
            { name: 'Priya Patel', action: 'updated their profile', time: '5 hours ago' },
            { name: 'Amit Kumar', action: 'registered for the reunion', time: '1 day ago' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {item.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-primary-800">
                  <span className="font-semibold">{item.name}</span>{' '}
                  {item.action}
                </p>
                <p className="text-xs text-primary-400 mt-0.5">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
