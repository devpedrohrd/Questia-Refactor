import type { Attempt } from '@repo/api'
import api from '../api'

export type AnswerItem = {
  questionId: string
  alternativeId?: string
  response?: string
}

export type SubmitAttemptRequest = {
  quizId: string
  answers: AnswerItem[]
}

export type AttemptWithDetails = Attempt & {
  quiz?: { id: string; title: string; theme: string }
  answers?: {
    id: string
    response: string
    isCorrect: boolean
    questionId: string
    question?: {
      id: string
      statement: string
      correctAnswer?: string
      explanation?: string
    }
  }[]
}

export const attemptsService = {
  async submit(data: SubmitAttemptRequest) {
    const res = await api.post<Attempt>('/attempts', data)
    return res.data
  },

  async getMyAttempts() {
    const res = await api.get<AttemptWithDetails[]>('/attempts/my')
    return res.data
  },

  async getByQuiz(quizId: string) {
    const res = await api.get<AttemptWithDetails[]>(`/attempts/quiz/${quizId}`)
    return res.data
  },

  async getById(id: string) {
    const res = await api.get<AttemptWithDetails>(`/attempts/${id}`)
    return res.data
  },
}
