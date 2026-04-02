import { Injectable } from '@nestjs/common'
import { GenerationContext } from '@repo/api'
import { PrismaService } from '../../../../config/prisma/prisma.service'
import {
  IGenerationContextRepository,
  CreateGenerationContextInput,
  UpdateGenerationContextInput,
} from '../../domain/repositories/generation-context.repository'
import { PrismaGenerationContextMapper } from '../mappers/prisma-generation-context.mapper'

@Injectable()
export class PrismaGenerationContextRepository implements IGenerationContextRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateGenerationContextInput): Promise<GenerationContext> {
    const context = await this.prisma.generationContext.create({ data })
    return PrismaGenerationContextMapper.toDomain(context)
  }

  async findById(id: string): Promise<GenerationContext | null> {
    const context = await this.prisma.generationContext.findUnique({
      where: { id },
    })
    return context ? PrismaGenerationContextMapper.toDomain(context) : null
  }

  async findByUserId(userId: string): Promise<GenerationContext[]> {
    const contexts = await this.prisma.generationContext.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
    return contexts.map(PrismaGenerationContextMapper.toDomain)
  }

  async findByName(name: string): Promise<GenerationContext | null> {
    const context = await this.prisma.generationContext.findFirst({
      where: { name },
    })
    return context ? PrismaGenerationContextMapper.toDomain(context) : null
  }

  async update(
    id: string,
    data: UpdateGenerationContextInput,
  ): Promise<GenerationContext> {
    const context = await this.prisma.generationContext.update({
      where: { id },
      data,
    })
    return PrismaGenerationContextMapper.toDomain(context)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.generationContext.delete({ where: { id } })
  }
}
