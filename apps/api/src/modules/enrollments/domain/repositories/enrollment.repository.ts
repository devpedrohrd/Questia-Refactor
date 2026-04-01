import { Enrollment, Role } from '@repo/api'

export type CreateEnrollmentInput = {
  userId: string
  classId: string
  role: Role
}

export interface IEnrollmentRepository {
  create(data: CreateEnrollmentInput): Promise<Enrollment>
  findById(id: string): Promise<Enrollment | null>
  findByClassId(classId: string): Promise<Enrollment[]>
  findByUserId(userId: string): Promise<Enrollment[]>
  findByUserAndClass(
    userId: string,
    classId: string,
  ): Promise<Enrollment | null>
  delete(id: string): Promise<void>
}

export const ENROLLMENT_REPOSITORY = Symbol('ENROLLMENT_REPOSITORY')
