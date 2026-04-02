import { Module } from '@nestjs/common'
import { GenerationContextController } from './presentation/controllers/generation-context.controller'
import { CreateGenerationContextUseCase } from './application/use-cases/create-generation-context.use-case'
import { FindGenerationContextUseCase } from './application/use-cases/find-generation-context.use-case'
import { FindGenerationContextsByUserUseCase } from './application/use-cases/find-generation-contexts-by-user.use-case'
import { UpdateGenerationContextUseCase } from './application/use-cases/update-generation-context.use-case'
import { DeleteGenerationContextUseCase } from './application/use-cases/delete-generation-context.use-case'
import { GENERATION_CONTEXT_REPOSITORY } from './domain/repositories/generation-context.repository'
import { PrismaGenerationContextRepository } from './infrastructure/repositories/prisma-generation-context.repository'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [AuthModule],
  controllers: [GenerationContextController],
  providers: [
    CreateGenerationContextUseCase,
    FindGenerationContextUseCase,
    FindGenerationContextsByUserUseCase,
    UpdateGenerationContextUseCase,
    DeleteGenerationContextUseCase,
    {
      provide: GENERATION_CONTEXT_REPOSITORY,
      useClass: PrismaGenerationContextRepository,
    },
  ],
  exports: [GENERATION_CONTEXT_REPOSITORY],
})
export class GenerationContextsModule {}
