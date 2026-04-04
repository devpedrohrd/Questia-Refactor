import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { Inject, Logger } from '@nestjs/common'
import {
  IAttemptRepository,
  ATTEMPT_REPOSITORY,
  CreateAnswerInput,
} from '../../domain/repositories/attempt.repository'
import {
  IQuizRepository,
  QUIZ_REPOSITORY,
} from '../../../quizzes/domain/repositories/quiz.repository'
import { AnswerInput } from '../../application/use-cases/submit-attempt.use-case'
import { QuizNotFoundException } from 'src/modules/quizzes/domain/exceptions/quiz-not-found.exception'

@Processor('attempts', { skipVersionCheck: true })
export class GradeAttemptProcessor extends WorkerHost {
  private readonly logger = new Logger(GradeAttemptProcessor.name)

  constructor(
    @Inject(ATTEMPT_REPOSITORY)
    private readonly attemptRepository: IAttemptRepository,
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
  ) {
    super()
  }

  async process(
    job: Job<{ attemptId: string; quizId: string; answers: AnswerInput[] }>,
  ): Promise<any> {
    if (job.name === 'grade-attempt') {
      const { attemptId, quizId, answers } = job.data

      this.logger.log(`Iniciando correção da tentativa: ${attemptId}`)

      try {
        const quiz = await this.quizRepository.findByIdWithQuestions(quizId)
        if (!quiz) throw new QuizNotFoundException(quizId)

        const questionMap = new Map<string, any>()
        const alternativeMap = new Map<string, any>()

        for (const question of quiz.questions) {
          questionMap.set(question.id, question)
          for (const alt of question.alternatives ?? []) {
            alternativeMap.set(alt.id, alt)
          }
        }

        const correctedAnswers: CreateAnswerInput[] = []
        let score = 0

        for (const answer of answers) {
          const question = questionMap.get(answer.questionId)
          if (!question) continue

          let isCorrect = false
          let responseText = ''

          if (
            question.type === 'MULTIPLA_ESCOLHA' ||
            question.type === 'VERDADEIRO_FALSO'
          ) {
            const chosenAlternative = alternativeMap.get(
              answer.alternativeId as string,
            )
            if (chosenAlternative) {
              isCorrect = chosenAlternative.isCorrect
              responseText = chosenAlternative.text
            }
          } else {
            isCorrect = true
            responseText = answer.response ?? ''
          }

          if (isCorrect) score++

          correctedAnswers.push({
            questionId: answer.questionId,
            alternativeId: answer.alternativeId,
            response: responseText,
            isCorrect,
          })
        }

        const totalQuestions = quiz.questions.length
        const percentage =
          totalQuestions > 0
            ? Math.round((score / totalQuestions) * 10000) / 100
            : 0

        await this.attemptRepository.update(attemptId, {
          status: 'COMPLETED',
          score,
          percentage,
          totalQuestions,
          answers: correctedAnswers,
        })

        this.logger.log(
          `Correção concluída para tentativa: ${attemptId} — Score: ${score}/${totalQuestions}`,
        )

        return { success: true, score, percentage }
      } catch (error: any) {
        this.logger.error(`Tentativa ${attemptId} falhou:`, error.stack)
        await this.attemptRepository.update(attemptId, { status: 'FAILED' })
        throw error
      }
    }
  }
}
