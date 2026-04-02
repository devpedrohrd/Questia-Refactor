import { Inject, Injectable } from '@nestjs/common'
import { Quiz } from '@repo/api'
import {
  IQuizRepository,
  QUIZ_REPOSITORY,
} from '../../domain/repositories/quiz.repository'

@Injectable()
export class FindQuizzesByClassUseCase {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
  ) {}

  async execute(classId: string): Promise<Quiz[]> {
    return this.quizRepository.findByClassId(classId)
  }
}
