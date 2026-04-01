import { Class } from '@repo/api'
import { Class as PrismaClass } from '@prisma/client'

export class PrismaClassMapper {
  static toDomain(prismaClass: PrismaClass): Class {
    return {
      id: prismaClass.id,
      name: prismaClass.name,
      subject: prismaClass.subject,
      description: prismaClass.description ?? undefined,
      code: prismaClass.code,
      teacherId: prismaClass.teacherId,
      createdAt: prismaClass.createdAt,
      updatedAt: prismaClass.updatedAt,
    }
  }
}
