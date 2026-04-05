import { Inject, Injectable } from '@nestjs/common'
import {
  IQuizRepository,
  QUIZ_REPOSITORY,
} from '../../domain/repositories/quiz.repository'
import { QuizNotFoundException } from '../../domain/exceptions/quiz-not-found.exception'
import { Cacheable } from 'src/common/cache'

@Injectable()
export class FindQuizUseCase {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
  ) {}

  @Cacheable('quiz', 300)
  async execute(id: string) {
    const quiz = await this.quizRepository.findByIdForStudent(id)

    if (!quiz) {
      throw new QuizNotFoundException(id)
    }

    return quiz
  }
}
