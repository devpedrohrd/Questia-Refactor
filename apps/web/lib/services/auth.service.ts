import api from '../api'

export type LoginRequest = {
  email: string
  password: string
}

export type RegisterRequest = {
  name: string
  email: string
  password: string
}

export type AuthResponse = {
  access_token: string
  refresh_token: string
}

export const authService = {
  async login(data: LoginRequest) {
    const res = await api.post<AuthResponse>('/auth/login', data)
    return res.data
  },

  async register(data: RegisterRequest) {
    const res = await api.post<AuthResponse>('/auth/register', data)
    return res.data
  },

  async refresh() {
    const res = await api.post<AuthResponse>('/auth/refresh', {})
    return res.data
  },

  async logout() {
    const res = await api.get('/auth/logout')
    return res.data
  },

  async forgotPassword(email: string) {
    const res = await api.post('/auth/forgot-password', { email })
    return res.data
  },

  async resetPassword(token: string, newPassword: string) {
    const res = await api.post('/auth/reset-password', { token, newPassword })
    return res.data
  },
}
