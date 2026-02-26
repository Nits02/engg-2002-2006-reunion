import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="flex items-center justify-center py-20 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-primary-700">404</h1>
        <p className="text-lg text-primary-600 mb-6">Page not found</p>
        <Link to="/" className="text-accent-500 hover:text-accent-600 font-semibold underline transition-colors">
          Go back home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
