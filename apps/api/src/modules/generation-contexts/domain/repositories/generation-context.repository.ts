import {
  GenerationContext,
  CognitiveLevel,
  LanguageStyle,
  DifficultyStrategy,
} from '@repo/api'
import { Prisma } from '@prisma/client'

export type CreateGenerationContextInput = {
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
  examples?: Prisma.InputJsonValue
  userId: string
}

export type UpdateGenerationContextInput = {
  name?: string
  gradeLevel?: string
  subject?: string
  topic?: string
  learningObjectives?: string[]
  cognitiveLevel?: CognitiveLevel
  languageStyle?: LanguageStyle
  difficultyStrategy?: DifficultyStrategy
  rules?: string[]
  referenceMaterial?: string
  examples?: Prisma.InputJsonValue
}

export interface IGenerationContextRepository {
  create(data: CreateGenerationContextInput): Promise<GenerationContext>
  findById(id: string): Promise<GenerationContext | null>
  findByUserId(userId: string): Promise<GenerationContext[]>
  findByName(name: string): Promise<GenerationContext | null>
  update(
    id: string,
    data: UpdateGenerationContextInput,
  ): Promise<GenerationContext>
  delete(id: string): Promise<void>
}

export const GENERATION_CONTEXT_REPOSITORY = Symbol(
  'GENERATION_CONTEXT_REPOSITORY',
)
