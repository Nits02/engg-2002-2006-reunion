import { Outlet, Link } from 'react-router-dom'

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            ENGG Reunion
          </Link>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <Link to="/about" className="hover:text-blue-600">About</Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gray-100 text-center py-4 text-sm text-gray-500">
        &copy; 2026 ENGG 2002-2006 Reunion
      </footer>
    </div>
  )
}

export default MainLayout
