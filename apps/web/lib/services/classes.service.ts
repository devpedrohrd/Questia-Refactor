import type { Class } from '@repo/api'
import api from '../api'

export type CreateClassRequest = {
  name: string
  subject: string
  description?: string
}

export type UpdateClassRequest = Partial<CreateClassRequest>

export const classesService = {
  async create(data: CreateClassRequest) {
    const res = await api.post<Class>('/classes', data)
    return res.data
  },

  async getMyClasses() {
    const res = await api.get<Class[]>('/classes/my')
    return res.data
  },

  async getById(id: string) {
    const res = await api.get<Class>(`/classes/${id}`)
    return res.data
  },

  async update(id: string, data: UpdateClassRequest) {
    const res = await api.patch<Class>(`/classes/${id}`, data)
    return res.data
  },

  async delete(id: string) {
    await api.delete(`/classes/${id}`)
  },
}
