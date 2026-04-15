import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'

interface Props {
  allowedRoles?: ('SELLER' | 'BUYER')[]
}

export function ProtectedRoute({ allowedRoles }: Props) {
  const { isAuthenticated, user } = useSelector((s: RootState) => s.auth)

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }
  return <Outlet />
}
