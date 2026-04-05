import type { User } from '@repo/api'
import api from '../api'

export type UpdateUserRequest = {
  name?: string
  email?: string
  password?: string
}

export const usersService = {
  async getMe() {
    const res = await api.get<User>('/users/me')
    return res.data
  },

  async getById(id: string) {
    const res = await api.get<User>(`/users/${id}`)
    return res.data
  },

  async update(id: string, data: UpdateUserRequest) {
    const res = await api.patch<User>(`/users/${id}`, data)
    return res.data
  },

  async delete(id: string) {
    await api.delete(`/users/${id}`)
  },
}
