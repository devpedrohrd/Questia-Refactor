import { Injectable } from '@nestjs/common'
import { Enrollment } from '@repo/api'
import { PrismaService } from '../../../../config/prisma/prisma.service'
import {
  IEnrollmentRepository,
  CreateEnrollmentInput,
} from '../../domain/repositories/enrollment.repository'
import { PrismaEnrollmentMapper } from '../mappers/prisma-enrollment.mapper'

@Injectable()
export class PrismaEnrollmentRepository implements IEnrollmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateEnrollmentInput): Promise<Enrollment> {
    const enrollment = await this.prisma.enrollment.create({ data })
    return PrismaEnrollmentMapper.toDomain(enrollment)
  }

  async findById(id: string): Promise<Enrollment | null> {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
    })
    return enrollment ? PrismaEnrollmentMapper.toDomain(enrollment) : null
  }

  async findByClassId(classId: string): Promise<Enrollment[]> {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { classId },
      orderBy: { createdAt: 'desc' },
    })
    return enrollments.map(PrismaEnrollmentMapper.toDomain)
  }

  async findByUserId(userId: string): Promise<Enrollment[]> {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
    return enrollments.map(PrismaEnrollmentMapper.toDomain)
  }

  async findByUserAndClass(
    userId: string,
    classId: string,
  ): Promise<Enrollment | null> {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_classId: { userId, classId },
      },
    })
    return enrollment ? PrismaEnrollmentMapper.toDomain(enrollment) : null
  }

  async delete(id: string): Promise<void> {
    await this.prisma.enrollment.delete({ where: { id } })
  }
}
