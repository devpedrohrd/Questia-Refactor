import { Class } from '@repo/api'

export type CreateClassInput = {
  name: string
  subject: string
  description?: string
  code: string
  teacherId: string
}

export type UpdateClassInput = {
  name?: string
  subject?: string
  description?: string
}

export interface IClassRepository {
  create(data: CreateClassInput): Promise<Class>
  findById(id: string): Promise<Class | null>
  findByCode(code: string): Promise<Class | null>
  findByTeacherId(teacherId: string): Promise<Class[]>
  update(id: string, data: UpdateClassInput): Promise<Class>
  delete(id: string): Promise<void>
}

export const CLASS_REPOSITORY = Symbol('CLASS_REPOSITORY')
