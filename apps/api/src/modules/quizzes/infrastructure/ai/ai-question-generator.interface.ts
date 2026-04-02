import { GenerationContext, Difficulty, QuestionType } from '@repo/api'

export interface GeneratedQuestion {
  statement: string
  type: QuestionType
  explanation?: string
  correctAnswer?: string
  alternatives?: { text: string; isCorrect: boolean }[]
}

export interface GenerateQuestionsParams {
  theme: string
  difficulty: Difficulty
  questionType: QuestionType
  questionCount: number
  generationContext?: GenerationContext
}

export interface IAIQuestionGenerator {
  generateQuestions(
    params: GenerateQuestionsParams,
  ): Promise<GeneratedQuestion[]>
}

export const AI_QUESTION_GENERATOR = Symbol('AI_QUESTION_GENERATOR')
