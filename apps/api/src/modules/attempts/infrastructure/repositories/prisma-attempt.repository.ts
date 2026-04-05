import { Injectable } from '@nestjs/common'
import { Attempt } from '@repo/api'
import { PrismaService } from '../../../../config/prisma/prisma.service'
import {
  IAttemptRepository,
  CreateAttemptInput,
  AttemptWithAnswers,
} from '../../domain/repositories/attempt.repository'
import { PrismaAttemptMapper } from '../mappers/prisma-attempt.mapper'

@Injectable()
export class PrismaAttemptRepository implements IAttemptRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAttemptInput): Promise<Attempt> {
    const { answers, ...attemptData } = data

    const attempt = await this.prisma.attempt.create({
      data: {
        ...attemptData,
        ...(answers && {
          answers: {
            createMany: {
              data: answers.map((a) => ({
                response: a.response,
                isCorrect: a.isCorrect,
                questionId: a.questionId,
              })),
            },
          },
        }),
      },
    })

    return PrismaAttemptMapper.toDomain(attempt)
  }

  async update(
    id: string,
    data: Partial<CreateAttemptInput>,
  ): Promise<Attempt> {
    const { answers, ...attemptData } = data

    const attempt = await this.prisma.attempt.update({
      where: { id },
      data: {
        ...attemptData,
        ...(answers && {
          answers: {
            createMany: {
              data: answers.map((a) => ({
                response: a.response,
                isCorrect: a.isCorrect,
                questionId: a.questionId,
              })),
            },
          },
        }),
      },
    })

    return PrismaAttemptMapper.toDomain(attempt)
  }

  async findById(id: string): Promise<Attempt | null> {
    const attempt = await this.prisma.attempt.findUnique({ where: { id } })
    return attempt ? PrismaAttemptMapper.toDomain(attempt) : null
  }

  async findByIdWithAnswers(id: string): Promise<AttemptWithAnswers | null> {
    const attempt = await this.prisma.attempt.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        score: true,
        totalQuestions: true,
        percentage: true,
        userId: true,
        quizId: true,
        createdAt: true,

        answers: {
          orderBy: {
            createdAt: 'asc',
          },

          select: {
            id: true,
            response: true,
            isCorrect: true,
            questionId: true,
            attemptId: true,
            createdAt: true,

            question: {
              select: {
                id: true,
                statement: true,
                type: true,
                explanation: true,

                alternatives: {
                  select: {
                    id: true,
                    text: true,
                    isCorrect: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!attempt) return null

    return attempt
  }

  async findByQuizId(quizId: string): Promise<Attempt[]> {
    const attempts = await this.prisma.attempt.findMany({
      where: { quizId },
      orderBy: { createdAt: 'desc' },
    })
    return attempts.map(PrismaAttemptMapper.toDomain)
  }

  async findByUserId(userId: string): Promise<Attempt[]> {
    const attempts = await this.prisma.attempt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
    return attempts.map(PrismaAttemptMapper.toDomain)
  }

  async findByUserAndQuiz(
    userId: string,
    quizId: string,
  ): Promise<Attempt | null> {
    const attempt = await this.prisma.attempt.findFirst({
      where: { userId, quizId },
    })
    return attempt ? PrismaAttemptMapper.toDomain(attempt) : null
  }
}
