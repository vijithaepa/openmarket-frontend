import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ShoppingBag, Tag, MessageSquare, PlusCircle } from 'lucide-react'
import { RootState } from '../store/store'

export function DashboardPage() {
  const { user } = useSelector((s: RootState) => s.auth)
  const isSeller = user?.role === 'SELLER'

  const cards = isSeller
    ? [
        { to: '/my-listings', icon: ShoppingBag, label: 'My Listings', desc: 'Manage your product listings' },
        { to: '/offers', icon: Tag, label: 'Offers Received', desc: 'Review and respond to offers' },
      ]
    : [
        { to: '/products', icon: ShoppingBag, label: 'Browse Products', desc: 'Find fresh produce to buy' },
        { to: '/offers/my', icon: Tag, label: 'My Offers', desc: 'Track offers you have made' },
      ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Welcome, {user?.fullName}!</h2>
        <p className="text-sm text-gray-500 mt-1">
          {isSeller ? 'Manage your listings and respond to buyer offers.' : 'Discover fresh produce and make the best deals.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map(({ to, icon: Icon, label, desc }) => (
          <Link
            key={to}
            to={to}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-shadow"
          >
            <div className="bg-primary-50 rounded-lg p-2.5">
              <Icon size={22} className="text-primary-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
            </div>
          </Link>
        ))}

        <Link
          to="/products"
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-shadow"
        >
          <div className="bg-primary-50 rounded-lg p-2.5">
            <MessageSquare size={22} className="text-primary-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">Marketplace</p>
            <p className="text-xs text-gray-500 mt-0.5">All active product listings</p>
          </div>
        </Link>

        {isSeller && (
          <Link
            to="/my-listings/new"
            className="bg-primary-600 text-white rounded-xl shadow-sm p-5 flex items-start gap-4 hover:bg-primary-700 transition-colors"
          >
            <div className="bg-primary-500 rounded-lg p-2.5">
              <PlusCircle size={22} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm">New Listing</p>
              <p className="text-xs text-primary-200 mt-0.5">Post a new product for sale</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}
