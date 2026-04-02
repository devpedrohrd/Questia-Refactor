import { Inject, Injectable } from '@nestjs/common'
import { GenerationContext } from '@repo/api'
import {
  IGenerationContextRepository,
  GENERATION_CONTEXT_REPOSITORY,
  UpdateGenerationContextInput,
} from '../../domain/repositories/generation-context.repository'
import { GenerationContextNotFoundException } from '../../domain/exceptions/generation-context-not-found.exception'
import { GenerationContextNotAuthorizedException } from '../../domain/exceptions/generation-context-not-authorized.exception'
import { AuthenticatedUser } from 'src/common/interfaces'
import { Role } from 'src/common/enums'

@Injectable()
export class UpdateGenerationContextUseCase {
  constructor(
    @Inject(GENERATION_CONTEXT_REPOSITORY)
    private readonly repository: IGenerationContextRepository,
  ) {}

  async execute(
    id: string,
    data: UpdateGenerationContextInput,
    user: AuthenticatedUser,
  ): Promise<GenerationContext> {
    const existing = await this.repository.findById(id)

    if (!existing) {
      throw new GenerationContextNotFoundException(id)
    }

    if (existing.userId !== user.userId && user.role !== Role.ADMIN) {
      throw new GenerationContextNotAuthorizedException(
        'GENERATION_CONTEXT_NOT_AUTHORIZED',
      )
    }

    return this.repository.update(id, data)
  }
}
