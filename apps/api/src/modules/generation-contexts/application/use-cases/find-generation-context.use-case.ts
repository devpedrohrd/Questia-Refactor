import { Inject, Injectable } from '@nestjs/common'
import { GenerationContext } from '@repo/api'
import {
  IGenerationContextRepository,
  GENERATION_CONTEXT_REPOSITORY,
} from '../../domain/repositories/generation-context.repository'
import { GenerationContextNotFoundException } from '../../domain/exceptions/generation-context-not-found.exception'

@Injectable()
export class FindGenerationContextUseCase {
  constructor(
    @Inject(GENERATION_CONTEXT_REPOSITORY)
    private readonly repository: IGenerationContextRepository,
  ) {}

  async execute(id: string): Promise<GenerationContext> {
    const context = await this.repository.findById(id)

    if (!context) {
      throw new GenerationContextNotFoundException(id)
    }

    return context
  }
}
