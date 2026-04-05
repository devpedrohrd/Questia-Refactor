import type {
  Quiz,
  Difficulty,
  QuestionType,
  Question,
  Alternative,
} from '@repo/api'
import api from '../api'

export type CreateQuizRequest = {
  title: string
  theme: string
  difficulty: Difficulty
  questionType: QuestionType
  questionCount: number
  classId: string
  generationContextId?: string
}

export type GenerateQuestionsRequest = {
  generationContextId?: string
}

export type ConfirmQuestionItem = {
  statement: string
  type: QuestionType
  explanation?: string
  correctAnswer?: string
  alternatives?: { text: string; isCorrect: boolean }[]
}

export type ConfirmQuestionsRequest = {
  questions: ConfirmQuestionItem[]
}

export type QuizWithQuestions = Quiz & {
  questions?: (Question & { alternatives?: Alternative[] })[]
  class?: { id: string; name: string }
}

export type GeneratedPreviewResponse = {
  status: 'PENDING' | 'AVAILABLE' | 'FAILED'
  questions?: ConfirmQuestionItem[]
}

export const quizzesService = {
  async create(data: CreateQuizRequest) {
    const res = await api.post<Quiz>('/quizzes', data)
    return res.data
  },

  async generateQuestions(quizId: string, data?: GenerateQuestionsRequest) {
    const res = await api.post(`/quizzes/${quizId}/generate`, data || {})
    return res.data
  },

  async getGeneratedPreview(quizId: string) {
    const res = await api.get<GeneratedPreviewResponse>(
      `/quizzes/${quizId}/generated-preview`,
    )
    return res.data
  },

  async confirmQuestions(quizId: string, data: ConfirmQuestionsRequest) {
    const res = await api.post(`/quizzes/${quizId}/confirm`, data)
    return res.data
  },

  async getMyQuizzes() {
    const res = await api.get<Quiz[]>('/quizzes/my')
    return res.data
  },

  async getByClass(classId: string) {
    const res = await api.get<Quiz[]>(`/quizzes/class/${classId}`)
    return res.data
  },

  async getById(id: string) {
    const res = await api.get<QuizWithQuestions>(`/quizzes/${id}`)
    return res.data
  },

  async publish(id: string) {
    const res = await api.patch<Quiz>(`/quizzes/${id}/publish`)
    return res.data
  },

  async delete(id: string) {
    await api.delete(`/quizzes/${id}`)
  },
}
