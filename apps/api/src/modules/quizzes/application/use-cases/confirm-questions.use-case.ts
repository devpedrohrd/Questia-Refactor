import { Inject, Injectable } from '@nestjs/common'
import { Question } from '@repo/api'
import {
  IQuizRepository,
  QUIZ_REPOSITORY,
} from '../../domain/repositories/quiz.repository'
import {
  IQuestionRepository,
  QUESTION_REPOSITORY,
  CreateQuestionInput,
} from '../../domain/repositories/question.repository'
import { QuizNotFoundException } from '../../domain/exceptions/quiz-not-found.exception'
import { QuizNotAuthorizedException } from '../../domain/exceptions/quiz-not-authorized.exception'
import { QuizAlreadyPublishedException } from '../../domain/exceptions/quiz-already-published.exception'
import { AuthenticatedUser } from 'src/common/interfaces'
import { Role } from 'src/common/enums'
import { Redis } from 'ioredis'

@Injectable()
export class ConfirmQuestionsUseCase {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
    @Inject(QUESTION_REPOSITORY)
    private readonly questionRepository: IQuestionRepository,
  ) {
    this.redis = new Redis(process.env.REDIS_URL as string)
  }

  private readonly redis: Redis

  async execute(
    quizId: string,
    questions: Omit<CreateQuestionInput, 'quizId'>[],
    user: AuthenticatedUser,
  ): Promise<Question[]> {
    const quiz = await this.quizRepository.findById(quizId)

    if (!quiz) {
      throw new QuizNotFoundException(quizId)
    }

    if (quiz.userId !== user.userId && user.role !== Role.ADMIN) {
      throw new QuizNotAuthorizedException('QUIZ_NOT_AUTHORIZED')
    }

    if (quiz.status === 'PUBLISHED') {
      throw new QuizAlreadyPublishedException(quizId)
    }

    // Remove existing questions if regenerating
    await this.questionRepository.deleteByQuizId(quizId)

    const questionsWithQuizId: CreateQuestionInput[] = questions.map((q) => ({
      ...q,
      quizId,
    }))

    const savedQuestions =
      await this.questionRepository.createMany(questionsWithQuizId)

    await this.quizRepository.updateStatus(quizId, 'GENERATED')

    // Clean up Redis cache since it is formally saved
    const redisKey = `quiz-preview:${quizId}`
    await this.redis.del(redisKey)

    return savedQuestions
  }
}
