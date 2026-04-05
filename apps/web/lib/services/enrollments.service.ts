import type { Enrollment } from '@repo/api'
import api from '../api'

export type EnrollmentWithClass = Enrollment & {
  class?: {
    id: string
    name: string
    subject: string
    code: string
  }
}

export const enrollmentsService = {
  async enroll(classCode: string) {
    const res = await api.post<Enrollment>('/enrollments', { classCode })
    return res.data
  },

  async getMyEnrollments() {
    const res = await api.get<EnrollmentWithClass[]>('/enrollments/my')
    return res.data
  },

  async getByClass(classId: string) {
    const res = await api.get<EnrollmentWithClass[]>(
      `/enrollments/class/${classId}`,
    )
    return res.data
  },

  async getById(id: string) {
    const res = await api.get<Enrollment>(`/enrollments/${id}`)
    return res.data
  },

  async unenroll(id: string) {
    await api.delete(`/enrollments/${id}`)
  },
}
