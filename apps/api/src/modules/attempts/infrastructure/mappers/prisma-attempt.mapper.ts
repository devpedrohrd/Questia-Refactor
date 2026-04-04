import { Attempt } from '@repo/api'
import { Attempt as PrismaAttempt } from '@prisma/client'

export class PrismaAttemptMapper {
  static toDomain(prisma: PrismaAttempt): Attempt {
    return {
      id: prisma.id,
      status: prisma.status as 'PROCESSING' | 'COMPLETED' | 'FAILED',
      score: prisma.score,
      totalQuestions: prisma.totalQuestions,
      percentage: prisma.percentage,
      userId: prisma.userId,
      quizId: prisma.quizId,
      createdAt: prisma.createdAt,
    }
  }
}
