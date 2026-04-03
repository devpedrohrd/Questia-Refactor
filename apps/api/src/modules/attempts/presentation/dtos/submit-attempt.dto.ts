import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator'

export class AnswerItemDto {
  @ApiProperty({
    description: 'ID da questão',
    example: 'uuid-da-questao',
  })
  @IsString()
  @IsNotEmpty()
  questionId!: string

  @ApiPropertyOptional({
    description:
      'ID da alternativa escolhida (para múltipla escolha e verdadeiro/falso)',
    example: 'uuid-da-alternativa',
  })
  @ValidateIf((o) => !o.response)
  @IsString()
  @IsNotEmpty({ message: 'alternativeId ou response devem ser preenchidos' })
  alternativeId?: string

  @ApiPropertyOptional({
    description: 'Resposta escrita (para questões discursivas)',
    example: 'A resolução envolve...',
  })
  @ValidateIf((o) => !o.alternativeId)
  @IsString()
  @IsNotEmpty({ message: 'alternativeId ou response devem ser preenchidos' })
  response?: string
}

export class SubmitAttemptDto {
  @ApiProperty({
    description: 'ID do quiz',
    example: 'uuid-do-quiz',
  })
  @IsString()
  @IsNotEmpty()
  quizId!: string

  @ApiProperty({
    description: 'Lista de respostas do aluno',
    type: [AnswerItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerItemDto)
  answers!: AnswerItemDto[]
}
