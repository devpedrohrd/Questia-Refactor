import { Injectable } from '@nestjs/common'
import { User } from '@repo/api'
import { PrismaService } from '../../../../config/prisma/prisma.service'
import {
  IUserRepository,
  CreateUserInput,
  UpdateUserInput,
} from '../../domain/repositories/user.repository'
import { PrismaUserMapper } from '../mappers/prisma-user.mapper'

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserInput): Promise<User> {
    const user = await this.prisma.user.create({ data })
    return PrismaUserMapper.toDomain(user)
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } })
    return user ? PrismaUserMapper.toDomain(user) : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } })
    return user ? PrismaUserMapper.toDomain(user) : null
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data,
    })
    return PrismaUserMapper.toDomain(user)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } })
  }
}
