import { Attempt, Answer } from '@repo/api'

export type CreateAnswerInput = {
  response: string
  isCorrect: boolean
  questionId: string
  alternativeId?: string
}

export type CreateAttemptInput = {
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED'
  score: number
  totalQuestions: number
  percentage: number
  userId: string
  quizId: string
  answers?: CreateAnswerInput[]
}

export type AttemptWithAnswers = Attempt & {
  answers: (Answer & { question?: any })[]
}

export interface IAttemptRepository {
  create(data: CreateAttemptInput): Promise<Attempt>
  findById(id: string): Promise<Attempt | null>
  findByIdWithAnswers(id: string): Promise<AttemptWithAnswers | null>
  findByQuizId(quizId: string): Promise<Attempt[]>
  findByUserId(userId: string): Promise<Attempt[]>
  findByUserAndQuiz(userId: string, quizId: string): Promise<Attempt | null>
  update(id: string, data: Partial<CreateAttemptInput>): Promise<Attempt>
}

export const ATTEMPT_REPOSITORY = Symbol('ATTEMPT_REPOSITORY')
