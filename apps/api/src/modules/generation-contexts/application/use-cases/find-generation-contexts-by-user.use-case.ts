import { Inject, Injectable } from '@nestjs/common'
import { GenerationContext } from '@repo/api'
import {
  IGenerationContextRepository,
  GENERATION_CONTEXT_REPOSITORY,
} from '../../domain/repositories/generation-context.repository'

@Injectable()
export class FindGenerationContextsByUserUseCase {
  constructor(
    @Inject(GENERATION_CONTEXT_REPOSITORY)
    private readonly repository: IGenerationContextRepository,
  ) {}

  async execute(userId: string): Promise<GenerationContext[]> {
    return this.repository.findByUserId(userId)
  }
}
