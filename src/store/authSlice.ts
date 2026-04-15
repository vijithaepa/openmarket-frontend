import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthState, AuthResponse } from '../types/auth'

const loadFromStorage = (): Partial<AuthState> => {
  try {
    const raw = localStorage.getItem('auth')
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

const persisted = loadFromStorage()

const initialState: AuthState = {
  user: persisted.user ?? null,
  accessToken: persisted.accessToken ?? null,
  refreshToken: persisted.refreshToken ?? null,
  isAuthenticated: !!persisted.accessToken,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<AuthResponse>) {
      const { user, accessToken, refreshToken } = action.payload
      state.user = user
      state.accessToken = accessToken
      state.refreshToken = refreshToken
      state.isAuthenticated = true
      localStorage.setItem('auth', JSON.stringify({ user, accessToken, refreshToken }))
    },
    updateAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload
      const stored = loadFromStorage()
      localStorage.setItem('auth', JSON.stringify({ ...stored, accessToken: action.payload }))
    },
    logout(state) {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
      localStorage.removeItem('auth')
    },
  },
})

export const { setCredentials, updateAccessToken, logout } = authSlice.actions
export default authSlice.reducer
