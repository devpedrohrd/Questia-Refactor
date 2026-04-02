import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class GenerateQuestionsDto {
  @ApiPropertyOptional({
    description:
      'ID do contexto de geração (opcional, sobrescreve o do quiz se informado)',
    example: 'uuid-do-contexto',
  })
  @IsString()
  @IsOptional()
  generationContextId?: string
}
