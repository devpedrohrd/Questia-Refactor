import { Injectable } from '@nestjs/common'
import { Class } from '@repo/api'
import { PrismaService } from '../../../../config/prisma/prisma.service'
import {
  IClassRepository,
  CreateClassInput,
  UpdateClassInput,
} from '../../domain/repositories/class.repository'
import { PrismaClassMapper } from '../mappers/prisma-class.mapper'

@Injectable()
export class PrismaClassRepository implements IClassRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateClassInput): Promise<Class> {
    const classEntity = await this.prisma.class.create({ data })
    return PrismaClassMapper.toDomain(classEntity)
  }

  async findById(id: string): Promise<Class | null> {
    const classEntity = await this.prisma.class.findUnique({ where: { id } })
    return classEntity ? PrismaClassMapper.toDomain(classEntity) : null
  }

  async findByCode(code: string): Promise<Class | null> {
    const classEntity = await this.prisma.class.findUnique({ where: { code } })
    return classEntity ? PrismaClassMapper.toDomain(classEntity) : null
  }

  async findByTeacherId(teacherId: string): Promise<Class[]> {
    const classes = await this.prisma.class.findMany({
      where: { teacherId },
      orderBy: { createdAt: 'desc' },
    })
    return classes.map(PrismaClassMapper.toDomain)
  }

  async update(id: string, data: UpdateClassInput): Promise<Class> {
    const classEntity = await this.prisma.class.update({
      where: { id },
      data,
    })
    return PrismaClassMapper.toDomain(classEntity)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.class.delete({ where: { id } })
  }
}
