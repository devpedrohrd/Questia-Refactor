import { Inject, Injectable } from '@nestjs/common'
import { Attempt } from '@repo/api'
import {
  IAttemptRepository,
  ATTEMPT_REPOSITORY,
} from '../../domain/repositories/attempt.repository'
import { Cacheable } from 'src/common/cache'

@Injectable()
export class FindAttemptsByUserUseCase {
  constructor(
    @Inject(ATTEMPT_REPOSITORY)
    private readonly attemptRepository: IAttemptRepository,
  ) {}

  @Cacheable('attempts-by-user', 180)
  async execute(userId: string): Promise<Attempt[]> {
    return this.attemptRepository.findByUserId(userId)
  }
}
