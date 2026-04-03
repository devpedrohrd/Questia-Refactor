import { Quiz, Difficulty, QuestionType, QuizStatus } from '@repo/api'

export type CreateQuizInput = {
  title: string
  theme: string
  difficulty: Difficulty
  questionType: QuestionType
  questionCount: number
  accessLink: string
  status: QuizStatus
  userId: string
  classId: string
  generationContextId?: string
}

export interface IQuizRepository {
  create(data: CreateQuizInput): Promise<Quiz>
  findById(id: string): Promise<Quiz | null>
  findByIdWithQuestions(id: string): Promise<any | null>
  findByIdForStudent(id: string): Promise<any | null>
  findByClassId(classId: string): Promise<Quiz[]>
  findByUserId(userId: string): Promise<Quiz[]>
  findByAccessLink(accessLink: string): Promise<Quiz | null>
  updateStatus(id: string, status: QuizStatus): Promise<Quiz>
  delete(id: string): Promise<void>
}

export const QUIZ_REPOSITORY = Symbol('QUIZ_REPOSITORY')
