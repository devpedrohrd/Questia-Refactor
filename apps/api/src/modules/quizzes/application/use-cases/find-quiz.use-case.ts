import { Inject, Injectable } from '@nestjs/common'
import {
  IQuizRepository,
  QUIZ_REPOSITORY,
} from '../../domain/repositories/quiz.repository'
import { QuizNotFoundException } from '../../domain/exceptions/quiz-not-found.exception'

@Injectable()
export class FindQuizUseCase {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
  ) {}

  async execute(id: string) {
    const quiz = await this.quizRepository.findByIdWithQuestions(id)

    if (!quiz) {
      throw new QuizNotFoundException(id)
    }

    return quiz
  }
}
