import { Inject, Injectable } from '@nestjs/common'
import { Quiz } from '@repo/api'
import {
  IQuizRepository,
  QUIZ_REPOSITORY,
} from '../../domain/repositories/quiz.repository'
import { Cacheable } from 'src/common/cache'

@Injectable()
export class FindQuizzesByUserUseCase {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
  ) {}

  @Cacheable('quizzes-by-user', 180)
  async execute(userId: string): Promise<Quiz[]> {
    return this.quizRepository.findByUserId(userId)
  }
}
