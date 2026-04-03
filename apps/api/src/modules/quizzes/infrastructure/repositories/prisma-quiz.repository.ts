import { Injectable } from '@nestjs/common'
import { Quiz, QuizStatus } from '@repo/api'
import { PrismaService } from '../../../../config/prisma/prisma.service'
import {
  IQuizRepository,
  CreateQuizInput,
} from '../../domain/repositories/quiz.repository'
import { PrismaQuizMapper } from '../mappers/prisma-quiz.mapper'

@Injectable()
export class PrismaQuizRepository implements IQuizRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateQuizInput): Promise<Quiz> {
    const quiz = await this.prisma.quiz.create({ data })
    return PrismaQuizMapper.toDomain(quiz)
  }

  async findById(id: string): Promise<Quiz | null> {
    const quiz = await this.prisma.quiz.findUnique({ where: { id } })
    return quiz ? PrismaQuizMapper.toDomain(quiz) : null
  }

  async findByIdWithQuestions(id: string): Promise<any | null> {
    return this.prisma.quiz.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        questions: {
          orderBy: {
            createdAt: 'asc',
          },
          select: {
            id: true,
            statement: true,
            type: true,

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
    })
  }

  async findByIdForStudent(id: string): Promise<any | null> {
    return this.prisma.quiz.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        difficulty: true,
        questionType: true,
        questionCount: true,
        status: true,
        theme: true,
        accessLink: true,
        questions: {
          orderBy: {
            createdAt: 'asc',
          },
          select: {
            id: true,
            statement: true,
            alternatives: {
              select: {
                id: true,
                text: true,
              },
            },
          },
        },
      },
    })
  }

  async findByClassId(classId: string): Promise<Quiz[]> {
    const quizzes = await this.prisma.quiz.findMany({
      where: { classId },
      orderBy: { createdAt: 'desc' },
    })
    return quizzes.map(PrismaQuizMapper.toDomain)
  }

  async findByUserId(userId: string): Promise<Quiz[]> {
    const quizzes = await this.prisma.quiz.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
    return quizzes.map(PrismaQuizMapper.toDomain)
  }

  async findByAccessLink(accessLink: string): Promise<Quiz | null> {
    const quiz = await this.prisma.quiz.findUnique({
      where: { accessLink },
    })
    return quiz ? PrismaQuizMapper.toDomain(quiz) : null
  }

  async updateStatus(id: string, status: QuizStatus): Promise<Quiz> {
    const quiz = await this.prisma.quiz.update({
      where: { id },
      data: { status },
    })
    return PrismaQuizMapper.toDomain(quiz)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.quiz.delete({ where: { id } })
  }
}
