import { Inject, Injectable } from '@nestjs/common'
import {
  IAttemptRepository,
  ATTEMPT_REPOSITORY,
  AttemptWithAnswers,
} from '../../domain/repositories/attempt.repository'
import { AttemptNotFoundException } from '../../domain/exceptions/attempt-not-found.exception'

@Injectable()
export class FindAttemptUseCase {
  constructor(
    @Inject(ATTEMPT_REPOSITORY)
    private readonly attemptRepository: IAttemptRepository,
  ) {}

  async execute(id: string): Promise<AttemptWithAnswers> {
    const attempt = await this.attemptRepository.findByIdWithAnswers(id)

    if (!attempt) {
      throw new AttemptNotFoundException(id)
    }

    return attempt
  }
}
