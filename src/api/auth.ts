import client from './client'
import { AuthResponse, UserSummary } from '../types/auth'

export const authApi = {
  register: (data: { email: string; password: string; fullName: string; role: 'SELLER' | 'BUYER'; phone?: string }) =>
    client.post<AuthResponse>('/auth/register', data).then((r) => r.data),

  login: (data: { email: string; password: string }) =>
    client.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  me: () =>
    client.get<UserSummary>('/auth/me').then((r) => r.data),
}
