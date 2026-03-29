import { User, Role } from '@repo/api'

export type CreateUserInput = {
  name: string
  email: string
  role: Role
  password?: string
}

export type UpdateUserInput = {
  name?: string
  role?: Role
  email?: string
}

export interface IUserRepository {
  create(data: CreateUserInput): Promise<User>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  update(id: string, data: UpdateUserInput): Promise<User>
  delete(id: string): Promise<void>
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY')
