import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Bell, LogOut, ShoppingBag, Sprout } from 'lucide-react'
import { RootState } from '../../store/store'
import { logout } from '../../store/authSlice'
import { clearUnread } from '../../store/notificationSlice'

export function Navbar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((s: RootState) => s.auth)
  const { unreadCount } = useSelector((s: RootState) => s.notifications)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className="bg-primary-700 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <Sprout size={22} />
          <span className="hidden sm:inline">Farmers Market</span>
        </Link>

        <div className="flex items-center gap-4">
          {user?.role === 'SELLER' && (
            <Link to="/my-listings" className="hidden sm:flex items-center gap-1 text-sm hover:text-primary-200">
              <ShoppingBag size={16} />
              My Listings
            </Link>
          )}
          <Link to="/offers" className="hidden sm:flex items-center gap-1 text-sm hover:text-primary-200">
            Offers
          </Link>

          <button
            onClick={() => { dispatch(clearUnread()); navigate('/offers') }}
            className="relative p-1"
            title="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <span className="hidden sm:block text-sm text-primary-200">
            {user?.fullName} ({user?.role})
          </span>

          <button onClick={handleLogout} title="Logout" className="hover:text-primary-200">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  )
}
