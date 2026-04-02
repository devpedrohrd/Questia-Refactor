import { Inject, Injectable } from '@nestjs/common'
import {
  IQuizRepository,
  QUIZ_REPOSITORY,
} from '../../domain/repositories/quiz.repository'
import {
  IGenerationContextRepository,
  GENERATION_CONTEXT_REPOSITORY,
} from '../../../generation-contexts/domain/repositories/generation-context.repository'
import {
  IAIQuestionGenerator,
  AI_QUESTION_GENERATOR,
  GeneratedQuestion,
} from '../../infrastructure/ai/ai-question-generator.interface'
import { QuizNotFoundException } from '../../domain/exceptions/quiz-not-found.exception'
import { QuizNotAuthorizedException } from '../../domain/exceptions/quiz-not-authorized.exception'
import { AuthenticatedUser } from 'src/common/interfaces'
import { Role } from 'src/common/enums'

@Injectable()
export class GenerateQuestionsUseCase {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
    @Inject(GENERATION_CONTEXT_REPOSITORY)
    private readonly generationContextRepository: IGenerationContextRepository,
    @Inject(AI_QUESTION_GENERATOR)
    private readonly aiGenerator: IAIQuestionGenerator,
  ) {}

  async execute(
    quizId: string,
    generationContextId: string | undefined,
    user: AuthenticatedUser,
  ): Promise<GeneratedQuestion[]> {
    const quiz = await this.quizRepository.findById(quizId)

    if (!quiz) {
      throw new QuizNotFoundException(quizId)
    }

    if (quiz.userId !== user.userId && user.role !== Role.ADMIN) {
      throw new QuizNotAuthorizedException('QUIZ_NOT_AUTHORIZED')
    }

    const contextId = generationContextId || quiz.generationContextId
    const generationContext = contextId
      ? ((await this.generationContextRepository.findById(contextId)) ??
        undefined)
      : undefined

    return this.aiGenerator.generateQuestions({
      theme: quiz.theme,
      difficulty: quiz.difficulty,
      questionType: quiz.questionType,
      questionCount: quiz.questionCount,
      generationContext,
    })
  }
}
