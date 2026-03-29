import { Role } from '@repo/api'

export interface JwtPayload {
  sub: string
  email: string
  role: Role
}
