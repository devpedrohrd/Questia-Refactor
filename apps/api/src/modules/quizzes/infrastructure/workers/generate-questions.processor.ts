import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { Inject, Logger } from '@nestjs/common'
import { Redis } from 'ioredis'
import {
  IAIQuestionGenerator,
  AI_QUESTION_GENERATOR,
} from '../ai/ai-question-generator.interface'
import {
  IQuizRepository,
  QUIZ_REPOSITORY,
} from '../../domain/repositories/quiz.repository'
import {
  IGenerationContextRepository,
  GENERATION_CONTEXT_REPOSITORY,
} from '../../../generation-contexts/domain/repositories/generation-context.repository'
import { QuizNotFoundException } from '../../domain/exceptions/quiz-not-found.exception'

@Processor('quizzes', { skipVersionCheck: true })
export class GenerateQuestionsProcessor extends WorkerHost {
  private readonly logger = new Logger(GenerateQuestionsProcessor.name)
  private readonly redis: Redis

  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
    @Inject(GENERATION_CONTEXT_REPOSITORY)
    private readonly generationContextRepository: IGenerationContextRepository,
    @Inject(AI_QUESTION_GENERATOR)
    private readonly aiGenerator: IAIQuestionGenerator,
  ) {
    super()
    this.redis = new Redis(process.env.REDIS_URL as string)
  }

  async process(
    job: Job<{ quizId: string; generationContextId?: string }>,
  ): Promise<any> {
    if (job.name === 'generate-questions') {
      const { quizId, generationContextId } = job.data

      this.logger.log(`Iniciando geração de questões para quiz: ${quizId}`)

      try {
        const quiz = await this.quizRepository.findById(quizId)
        if (!quiz) {
          throw new QuizNotFoundException(quizId)
        }

        const contextId = generationContextId || quiz.generationContextId
        const generationContext = contextId
          ? ((await this.generationContextRepository.findById(contextId)) ??
            undefined)
          : undefined

        const questions = await this.aiGenerator.generateQuestions({
          theme: quiz.theme,
          difficulty: quiz.difficulty,
          questionType: quiz.questionType,
          questionCount: quiz.questionCount,
          generationContext,
        })

        const redisKey = `quiz-preview:${quizId}`
        await this.redis.set(redisKey, JSON.stringify(questions), 'EX', 7200)

        this.logger.log(`Questões geradas e salvas no cache: ${quizId}`)
        return { success: true, count: questions.length }
      } catch (error: any) {
        this.logger.error(
          `Falha ao gerar questões para ${quizId}:`,
          error.stack,
        )
        throw error
      }
    }
  }
}
