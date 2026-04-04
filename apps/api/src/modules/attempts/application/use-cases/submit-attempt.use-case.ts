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
import { InjectQueue } from '@nestjs/bullmq'
import { Queue } from 'bullmq'

export type AnswerInput = {
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
    @InjectQueue('attempts')
    private readonly attemptsQueue: Queue,
  ) {}

  async execute(
    quizId: string,
    answers: AnswerInput[],
    user: AuthenticatedUser,
  ): Promise<Attempt> {
    const quiz = await this.quizRepository.findById(quizId)

    if (!quiz) {
      throw new QuizNotFoundException(quizId)
    }

    if (quiz.status !== 'PUBLISHED') {
      throw new QuizNotPublishedException(quizId)
    }

    const pendingAttempt = await this.attemptRepository.create({
      status: 'PROCESSING',
      score: 0,
      totalQuestions: quiz.questionCount,
      percentage: 0,
      userId: user.userId,
      quizId,
    })

    await this.attemptsQueue.add('grade-attempt', {
      attemptId: pendingAttempt.id,
      quizId,
      answers,
    })

    return pendingAttempt
  }
}
