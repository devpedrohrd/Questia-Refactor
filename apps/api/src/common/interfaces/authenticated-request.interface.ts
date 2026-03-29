import { Request } from 'express'
import { Role } from '@repo/api'

export interface AuthenticatedUser {
  userId: string
  email: string
  role: Role
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser
}
