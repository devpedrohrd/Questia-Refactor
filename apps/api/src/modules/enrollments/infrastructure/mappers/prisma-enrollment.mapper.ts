import { Enrollment } from '@repo/api'
import { Enrollment as PrismaEnrollment } from '@prisma/client'

export class PrismaEnrollmentMapper {
  static toDomain(prismaEnrollment: PrismaEnrollment): Enrollment {
    return {
      id: prismaEnrollment.id,
      userId: prismaEnrollment.userId,
      classId: prismaEnrollment.classId,
      role: prismaEnrollment.role,
      createdAt: prismaEnrollment.createdAt,
    }
  }
}
