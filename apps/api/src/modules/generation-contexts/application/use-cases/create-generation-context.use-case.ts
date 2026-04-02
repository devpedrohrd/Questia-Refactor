import { ConflictException, Inject, Injectable } from '@nestjs/common'
import { GenerationContext } from '@repo/api'
import {
  IGenerationContextRepository,
  GENERATION_CONTEXT_REPOSITORY,
  CreateGenerationContextInput,
} from '../../domain/repositories/generation-context.repository'
import { AuthenticatedUser } from 'src/common/interfaces'

@Injectable()
export class CreateGenerationContextUseCase {
  constructor(
    @Inject(GENERATION_CONTEXT_REPOSITORY)
    private readonly repository: IGenerationContextRepository,
  ) {}

  async execute(
    data: Omit<CreateGenerationContextInput, 'userId'>,
    user: AuthenticatedUser,
  ): Promise<GenerationContext> {
    const contextExisting = await this.repository.findByName(data.name)

    if (contextExisting) {
      throw new ConflictException('Contexto já existe')
    }

    return this.repository.create({
      ...data,
      userId: user.userId,
    })
  }
}
