export interface UserSummary {
  id: string
  email: string
  fullName: string
  role: 'SELLER' | 'BUYER'
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  user: UserSummary
}

export interface AuthState {
  user: UserSummary | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
}
