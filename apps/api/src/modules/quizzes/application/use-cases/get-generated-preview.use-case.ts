import { Inject, Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'
import {
  IQuizRepository,
  QUIZ_REPOSITORY,
} from '../../domain/repositories/quiz.repository'
import { QuizNotFoundException } from '../../domain/exceptions/quiz-not-found.exception'
import { QuizNotAuthorizedException } from '../../domain/exceptions/quiz-not-authorized.exception'
import { AuthenticatedUser } from 'src/common/interfaces'
import { Role } from 'src/common/enums'
import { GeneratedQuestion } from '../../infrastructure/ai/ai-question-generator.interface'

@Injectable()
export class GetGeneratedPreviewUseCase {
  private readonly redis: Redis

  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
  ) {
    this.redis = new Redis(process.env.REDIS_URL as string)
  }

  async execute(
    quizId: string,
    user: AuthenticatedUser,
  ): Promise<{ status: string; questions?: GeneratedQuestion[] }> {
    const quiz = await this.quizRepository.findById(quizId)

    if (!quiz) {
      throw new QuizNotFoundException(quizId)
    }

    if (quiz.userId !== user.userId && user.role !== Role.ADMIN) {
      throw new QuizNotAuthorizedException('QUIZ_NOT_AUTHORIZED')
    }

    const redisKey = `quiz-preview:${quizId}`
    const cachedData = await this.redis.get(redisKey)

    if (!cachedData) {
      return { status: 'PENDING' }
    }

    const questions: GeneratedQuestion[] = JSON.parse(cachedData)
    return { status: 'AVAILABLE', questions }
  }
}
