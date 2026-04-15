import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="text-6xl font-bold text-primary-300">404</p>
      <p className="text-gray-500">Page not found</p>
      <Link to="/dashboard" className="text-primary-600 text-sm hover:underline">Go to Dashboard</Link>
    </div>
  )
}
