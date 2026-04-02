import { Question, QuestionType } from '@repo/api'

export type CreateQuestionInput = {
  statement: string
  type: QuestionType
  explanation?: string
  correctAnswer?: string
  quizId: string
  alternatives?: { text: string; isCorrect: boolean }[]
}

export interface IQuestionRepository {
  createMany(data: CreateQuestionInput[]): Promise<Question[]>
  findByQuizId(quizId: string): Promise<Question[]>
  deleteByQuizId(quizId: string): Promise<void>
}

export const QUESTION_REPOSITORY = Symbol('QUESTION_REPOSITORY')
