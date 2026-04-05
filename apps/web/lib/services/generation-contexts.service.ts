import type {
  GenerationContext,
  CognitiveLevel,
  LanguageStyle,
  DifficultyStrategy,
} from '@repo/api'
import api from '../api'

export type CreateGenerationContextRequest = {
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
  examples?: Record<string, unknown>
}

export type UpdateGenerationContextRequest =
  Partial<CreateGenerationContextRequest>

export const generationContextsService = {
  async create(data: CreateGenerationContextRequest) {
    const res = await api.post<GenerationContext>('/generation-contexts', data)
    return res.data
  },

  async getMyContexts() {
    const res = await api.get<GenerationContext[]>('/generation-contexts/my')
    return res.data
  },

  async getById(id: string) {
    const res = await api.get<GenerationContext>(`/generation-contexts/${id}`)
    return res.data
  },

  async update(id: string, data: UpdateGenerationContextRequest) {
    const res = await api.patch<GenerationContext>(
      `/generation-contexts/${id}`,
      data,
    )
    return res.data
  },

  async delete(id: string) {
    await api.delete(`/generation-contexts/${id}`)
  },
}
