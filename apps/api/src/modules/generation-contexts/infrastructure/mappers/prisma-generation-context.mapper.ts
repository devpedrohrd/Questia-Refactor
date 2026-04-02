import { GenerationContext } from '@repo/api'
import { GenerationContext as PrismaGenerationContext } from '@prisma/client'

export class PrismaGenerationContextMapper {
  static toDomain(prisma: PrismaGenerationContext): GenerationContext {
    return {
      id: prisma.id,
      name: prisma.name,
      gradeLevel: prisma.gradeLevel,
      subject: prisma.subject,
      topic: prisma.topic,
      learningObjectives: prisma.learningObjectives,
      cognitiveLevel: prisma.cognitiveLevel,
      languageStyle: prisma.languageStyle,
      difficultyStrategy: prisma.difficultyStrategy,
      rules: prisma.rules,
      referenceMaterial: prisma.referenceMaterial ?? undefined,
      examples: prisma.examples ?? undefined,
      userId: prisma.userId,
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
    }
  }
}
