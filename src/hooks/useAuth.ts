import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../store/store'
import { setCredentials, logout } from '../store/authSlice'
import { authApi } from '../api/auth'

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>()
  const { user, isAuthenticated, accessToken } = useSelector((s: RootState) => s.auth)

  const login = async (email: string, password: string) => {
    const data = await authApi.login({ email, password })
    dispatch(setCredentials(data))
    return data
  }

  const register = async (payload: {
    email: string
    password: string
    fullName: string
    role: 'SELLER' | 'BUYER'
    phone?: string
  }) => {
    const data = await authApi.register(payload)
    dispatch(setCredentials(data))
    return data
  }

  const signOut = () => dispatch(logout())

  return { user, isAuthenticated, accessToken, login, register, signOut }
}
