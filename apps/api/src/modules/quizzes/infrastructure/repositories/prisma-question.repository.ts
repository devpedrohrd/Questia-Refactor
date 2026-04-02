import { Injectable } from '@nestjs/common'
import { Question } from '@repo/api'
import { PrismaService } from '../../../../config/prisma/prisma.service'
import {
  IQuestionRepository,
  CreateQuestionInput,
} from '../../domain/repositories/question.repository'
import { PrismaQuestionMapper } from '../mappers/prisma-question.mapper'

@Injectable()
export class PrismaQuestionRepository implements IQuestionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMany(data: CreateQuestionInput[]): Promise<Question[]> {
    const questions: Question[] = []

    await this.prisma.$transaction(async (tx) => {
      for (const item of data) {
        const { alternatives, ...questionData } = item

        const question = await tx.question.create({
          data: {
            ...questionData,
            alternatives: alternatives
              ? {
                  createMany: {
                    data: alternatives.map((alt) => ({
                      text: alt.text,
                      isCorrect: alt.isCorrect,
                    })),
                  },
                }
              : undefined,
          },
        })

        questions.push(PrismaQuestionMapper.toDomain(question))
      }
    })

    return questions
  }

  async findByQuizId(quizId: string): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      where: { quizId },
      orderBy: { createdAt: 'asc' },
    })
    return questions.map(PrismaQuestionMapper.toDomain)
  }

  async deleteByQuizId(quizId: string): Promise<void> {
    await this.prisma.question.deleteMany({ where: { quizId } })
  }
}
