import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { AttemptController } from './presentation/controllers/attempt.controller'
import { SubmitAttemptUseCase } from './application/use-cases/submit-attempt.use-case'
import { FindAttemptUseCase } from './application/use-cases/find-attempt.use-case'
import { FindAttemptsByQuizUseCase } from './application/use-cases/find-attempts-by-quiz.use-case'
import { FindAttemptsByUserUseCase } from './application/use-cases/find-attempts-by-user.use-case'
import { ATTEMPT_REPOSITORY } from './domain/repositories/attempt.repository'
import { PrismaAttemptRepository } from './infrastructure/repositories/prisma-attempt.repository'
import { AuthModule } from '../auth/auth.module'
import { QuizzesModule } from '../quizzes/quizzes.module'
import { GradeAttemptProcessor } from './infrastructure/workers/grade-attempt.processor'

@Module({
  imports: [
    AuthModule,
    QuizzesModule,
    BullModule.registerQueue({
      name: 'attempts',
      skipVersionCheck: true,
      defaultJobOptions: {
        attempts: 3,
        removeOnFail: true,
      },
    }),
  ],
  controllers: [AttemptController],
  providers: [
    SubmitAttemptUseCase,
    FindAttemptUseCase,
    FindAttemptsByQuizUseCase,
    FindAttemptsByUserUseCase,
    {
      provide: ATTEMPT_REPOSITORY,
      useClass: PrismaAttemptRepository,
    },
    GradeAttemptProcessor,
  ],
  exports: [ATTEMPT_REPOSITORY],
})
export class AttemptsModule {}
