import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { QuizController } from './presentation/controllers/quiz.controller'
import { CreateQuizUseCase } from './application/use-cases/create-quiz.use-case'
import { GenerateQuestionsUseCase } from './application/use-cases/generate-questions.use-case'
import { ConfirmQuestionsUseCase } from './application/use-cases/confirm-questions.use-case'
import { FindQuizUseCase } from './application/use-cases/find-quiz.use-case'
import { FindQuizzesByClassUseCase } from './application/use-cases/find-quizzes-by-class.use-case'
import { FindQuizzesByUserUseCase } from './application/use-cases/find-quizzes-by-user.use-case'
import { PublishQuizUseCase } from './application/use-cases/publish-quiz.use-case'
import { DeleteQuizUseCase } from './application/use-cases/delete-quiz.use-case'
import { GetGeneratedPreviewUseCase } from './application/use-cases/get-generated-preview.use-case'
import { QUIZ_REPOSITORY } from './domain/repositories/quiz.repository'
import { QUESTION_REPOSITORY } from './domain/repositories/question.repository'
import { PrismaQuizRepository } from './infrastructure/repositories/prisma-quiz.repository'
import { PrismaQuestionRepository } from './infrastructure/repositories/prisma-question.repository'
import { AI_QUESTION_GENERATOR } from './infrastructure/ai/ai-question-generator.interface'
import { GeminiQuestionGeneratorService } from './infrastructure/ai/gemini-question-generator.service'
import { AuthModule } from '../auth/auth.module'
import { GenerationContextsModule } from '../generation-contexts/generation-contexts.module'
import { GenerateQuestionsProcessor } from './infrastructure/workers/generate-questions.processor'

@Module({
  imports: [
    AuthModule,
    GenerationContextsModule,
    BullModule.registerQueue({
      name: 'quizzes',
      skipVersionCheck: true,
    }),
  ],
  controllers: [QuizController],
  providers: [
    CreateQuizUseCase,
    GenerateQuestionsUseCase,
    ConfirmQuestionsUseCase,
    FindQuizUseCase,
    FindQuizzesByClassUseCase,
    FindQuizzesByUserUseCase,
    PublishQuizUseCase,
    DeleteQuizUseCase,
    GetGeneratedPreviewUseCase,
    {
      provide: QUIZ_REPOSITORY,
      useClass: PrismaQuizRepository,
    },
    {
      provide: QUESTION_REPOSITORY,
      useClass: PrismaQuestionRepository,
    },
    {
      provide: AI_QUESTION_GENERATOR,
      useClass: GeminiQuestionGeneratorService,
    },
    GenerateQuestionsProcessor,
  ],
  exports: [QUIZ_REPOSITORY],
})
export class QuizzesModule {}
