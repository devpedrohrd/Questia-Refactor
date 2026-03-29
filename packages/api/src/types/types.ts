// =========================
// ENUMS
// =========================

export type Role = 'PROFESSOR' | 'ALUNO' | 'ADMIN'

export type Difficulty = 'FACIL' | 'MEDIO' | 'DIFICIL'

export type QuestionType =
  | 'MULTIPLA_ESCOLHA'
  | 'VERDADEIRO_FALSO'
  | 'DISCURSIVA'

export type QuizStatus = 'DRAFT' | 'GENERATED' | 'PUBLISHED' | 'ARCHIVED'

export type CognitiveLevel =
  | 'LEMBRAR'
  | 'COMPREENDER'
  | 'APLICAR'
  | 'ANALISAR'
  | 'AVALIAR'
  | 'CRIAR'

export type LanguageStyle =
  | 'SIMPLES'
  | 'FORMAL'
  | 'TECNICO'
  | 'INFANTIL'
  | 'VESTIBULAR'
  | 'ENEM'

export type DifficultyStrategy = 'UNIFORME' | 'PROGRESSIVA' | 'PERSONALIZADA'

// =========================
// BASE TYPES
// =========================

export type ID = string

export type Timestamp = Date

// =========================
// USER
// =========================

export type User = {
  id: ID

  name: string

  email: string

  password?: string

  role: Role

  createdAt: Timestamp

  updatedAt: Timestamp
}

// =========================
// GENERATION CONTEXT
// =========================

export type GenerationContext = {
  id: ID

  name: string

  gradeLevel: string

  subject: string

  topic: string

  learningObjectives: string[]

  cognitiveLevel: CognitiveLevel

  languageStyle: LanguageStyle

  difficultyStrategy: DifficultyStrategy

  rules: string[]

  referenceMaterial?: string

  examples?: unknown

  userId: ID

  createdAt: Timestamp

  updatedAt: Timestamp
}

// =========================
// QUIZ
// =========================

export type Quiz = {
  id: ID

  title: string

  theme: string

  difficulty: Difficulty

  questionType: QuestionType

  questionCount: number

  accessLink: string

  status: QuizStatus

  userId: ID

  generationContextId?: ID

  createdAt: Timestamp

  updatedAt: Timestamp
}

// =========================
// QUESTION
// =========================

export type Question = {
  id: ID

  statement: string

  type: QuestionType

  explanation?: string

  correctAnswer?: string

  quizId: ID

  createdAt: Timestamp

  updatedAt: Timestamp
}

// =========================
// ALTERNATIVE
// =========================

export type Alternative = {
  id: ID

  text: string

  isCorrect: boolean

  questionId: ID

  createdAt: Timestamp
}

// =========================
// ATTEMPT
// =========================

export type Attempt = {
  id: ID

  score: number

  totalQuestions: number

  percentage: number

  userId: ID

  quizId: ID

  createdAt: Timestamp
}

// =========================
// ANSWER
// =========================

export type Answer = {
  id: ID

  response: string

  isCorrect: boolean

  questionId: ID

  attemptId: ID

  createdAt: Timestamp
}

// =========================
// REFRESH TOKEN
// =========================

export type RefreshToken = {
  id: ID

  token: string

  expiresAt: Timestamp

  userId: ID

  createdAt: Timestamp
}

// =========================
// DTOs (REQUESTS)
// =========================

export type CreateQuizDTO = {
  title: string

  theme: string

  difficulty: Difficulty

  questionType: QuestionType

  questionCount: number

  generationContextId?: ID
}

export type GenerateQuestionsDTO = {
  quizId: ID

  theme: string

  difficulty: Difficulty

  questionType: QuestionType

  questionCount: number

  generationContextId?: ID
}

export type AnswerQuestionDTO = {
  questionId: ID

  response: string
}

// =========================
// RESPONSES (API)
// =========================

export type QuizResponse = Quiz & {
  questions?: Question[]
}

export type AttemptResultResponse = {
  attemptId: ID

  score: number

  totalQuestions: number

  percentage: number
}

// =========================
// PAGINATION
// =========================

export type Pagination = {
  page: number

  limit: number
}

export type PaginatedResponse<T> = {
  data: T[]

  total: number

  page: number

  limit: number
}
