import { Quiz } from '@repo/api'
import { Quiz as PrismaQuiz } from '@prisma/client'

export class PrismaQuizMapper {
  static toDomain(prismaQuiz: PrismaQuiz): Quiz {
    return {
      id: prismaQuiz.id,
      title: prismaQuiz.title,
      theme: prismaQuiz.theme,
      difficulty: prismaQuiz.difficulty,
      questionType: prismaQuiz.questionType,
      questionCount: prismaQuiz.questionCount,
      accessLink: prismaQuiz.accessLink,
      status: prismaQuiz.status,
      userId: prismaQuiz.userId,
      generationContextId: prismaQuiz.generationContextId ?? undefined,
      createdAt: prismaQuiz.createdAt,
      updatedAt: prismaQuiz.updatedAt,
    }
  }
}
