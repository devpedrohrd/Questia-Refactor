import { Question } from '@repo/api'
import { Question as PrismaQuestion } from '@prisma/client'

export class PrismaQuestionMapper {
  static toDomain(prismaQuestion: PrismaQuestion): Question {
    return {
      id: prismaQuestion.id,
      statement: prismaQuestion.statement,
      type: prismaQuestion.type,
      explanation: prismaQuestion.explanation ?? undefined,
      correctAnswer: prismaQuestion.correctAnswer ?? undefined,
      quizId: prismaQuestion.quizId,
      createdAt: prismaQuestion.createdAt,
      updatedAt: prismaQuestion.updatedAt,
    }
  }
}
