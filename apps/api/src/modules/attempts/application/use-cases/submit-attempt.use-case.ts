import { Inject, Injectable } from '@nestjs/common'
import { Attempt } from '@repo/api'
import {
  IAttemptRepository,
  ATTEMPT_REPOSITORY,
  CreateAnswerInput,
} from '../../domain/repositories/attempt.repository'
import {
  IQuizRepository,
  QUIZ_REPOSITORY,
} from '../../../quizzes/domain/repositories/quiz.repository'
import { QuizNotFoundException } from '../../../quizzes/domain/exceptions/quiz-not-found.exception'
import { QuizNotPublishedException } from '../../domain/exceptions/quiz-not-published.exception'
import { AuthenticatedUser } from 'src/common/interfaces'

type AnswerInput = {
  questionId: string
  alternativeId?: string
  response?: string
}

@Injectable()
export class SubmitAttemptUseCase {
  constructor(
    @Inject(ATTEMPT_REPOSITORY)
    private readonly attemptRepository: IAttemptRepository,
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
  ) {}

  async execute(
    quizId: string,
    answers: AnswerInput[],
    user: AuthenticatedUser,
  ): Promise<Attempt> {
    const quiz = await this.getPublishedQuiz(quizId)

    const { questionMap, alternativeMap } = this.buildMaps(quiz)

    const { correctedAnswers, score } = this.correctAnswers(
      answers,
      questionMap,
      alternativeMap,
    )

    const totalQuestions = quiz.questions.length

    const percentage = this.calculatePercentage(score, totalQuestions)

    return this.saveAttempt({
      score,
      totalQuestions,
      percentage,
      userId: user.userId,
      quizId,
      answers: correctedAnswers,
    })
  }

  private async getPublishedQuiz(quizId: string) {
    const quiz = await this.quizRepository.findByIdWithQuestions(quizId)

    if (!quiz) {
      throw new QuizNotFoundException(quizId)
    }

    if (quiz.status !== 'PUBLISHED') {
      throw new QuizNotPublishedException(quizId)
    }

    return quiz
  }

  private buildMaps(quiz: any) {
    const questionMap = new Map<string, any>()

    const alternativeMap = new Map<string, any>()

    for (const question of quiz.questions) {
      questionMap.set(question.id, question)

      for (const alt of question.alternatives ?? []) {
        alternativeMap.set(alt.id, alt)
      }
    }

    return {
      questionMap,
      alternativeMap,
    }
  }

  private correctAnswers(
    answers: AnswerInput[],
    questionMap: Map<string, any>,
    alternativeMap: Map<string, any>,
  ) {
    const correctedAnswers: CreateAnswerInput[] = []

    let score = 0

    for (const answer of answers) {
      const question = questionMap.get(answer.questionId)

      if (!question) continue

      const { isCorrect, responseText } = this.evaluateAnswer(
        answer,
        question,
        alternativeMap,
      )

      if (isCorrect) score++

      correctedAnswers.push({
        questionId: answer.questionId,
        alternativeId: answer.alternativeId,
        response: responseText,
        isCorrect,
      })
    }

    return {
      correctedAnswers,
      score,
    }
  }

  private evaluateAnswer(
    answer: AnswerInput,
    question: any,
    alternativeMap: Map<string, any>,
  ) {
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

    return {
      isCorrect,
      responseText,
    }
  }

  private calculatePercentage(score: number, totalQuestions: number) {
    if (totalQuestions === 0) {
      return 0
    }

    return Math.round((score / totalQuestions) * 10000) / 100
  }

  private saveAttempt(data: {
    score: number
    totalQuestions: number
    percentage: number
    userId: string
    quizId: string
    answers: CreateAnswerInput[]
  }) {
    return this.attemptRepository.create(data)
  }
}
