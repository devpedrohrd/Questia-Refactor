import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'x-platform': 'web',
  },
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/refresh'
    ) {
      originalRequest._retry = true

      try {
        await api.post('/auth/refresh', {})
        return api(originalRequest)
      } catch {
        if (typeof window !== 'undefined') {
          const authPages = [
            '/login',
            '/register',
            '/forgot-password',
            '/reset-password',
          ]
          const isAuthPage = authPages.some((p) =>
            window.location.pathname.startsWith(p),
          )
          if (!isAuthPage) {
            window.location.href = '/login'
          }
        }
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)

export default api
