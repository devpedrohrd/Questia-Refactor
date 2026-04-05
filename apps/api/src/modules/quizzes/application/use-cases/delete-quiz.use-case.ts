import { Inject, Injectable } from '@nestjs/common'
import {
  IQuizRepository,
  QUIZ_REPOSITORY,
} from '../../domain/repositories/quiz.repository'
import { QuizNotFoundException } from '../../domain/exceptions/quiz-not-found.exception'
import { QuizNotAuthorizedException } from '../../domain/exceptions/quiz-not-authorized.exception'
import { QuizAlreadyPublishedException } from '../../domain/exceptions/quiz-already-published.exception'
import { AuthenticatedUser } from 'src/common/interfaces'
import { Role } from 'src/common/enums'
import { CacheInvalidate } from 'src/common/cache'

@Injectable()
export class DeleteQuizUseCase {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
  ) {}

  @CacheInvalidate(
    (id: string) => `cache:quiz:${id}`,
    'cache:quizzes-by-user:*',
    'cache:quizzes-by-class:*',
  )
  async execute(id: string, user: AuthenticatedUser): Promise<void> {
    const quiz = await this.quizRepository.findById(id)

    if (!quiz) {
      throw new QuizNotFoundException(id)
    }

    if (quiz.userId !== user.userId && user.role !== Role.ADMIN) {
      throw new QuizNotAuthorizedException('QUIZ_NOT_AUTHORIZED')
    }

    if (quiz.status === 'PUBLISHED') {
      throw new QuizAlreadyPublishedException(id)
    }

    await this.quizRepository.delete(id)
  }
}
