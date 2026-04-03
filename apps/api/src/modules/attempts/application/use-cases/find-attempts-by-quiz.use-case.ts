import { Inject, Injectable } from '@nestjs/common'
import { Attempt } from '@repo/api'
import {
  IAttemptRepository,
  ATTEMPT_REPOSITORY,
} from '../../domain/repositories/attempt.repository'

@Injectable()
export class FindAttemptsByQuizUseCase {
  constructor(
    @Inject(ATTEMPT_REPOSITORY)
    private readonly attemptRepository: IAttemptRepository,
  ) {}

  async execute(quizId: string): Promise<Attempt[]> {
    return this.attemptRepository.findByQuizId(quizId)
  }
}
