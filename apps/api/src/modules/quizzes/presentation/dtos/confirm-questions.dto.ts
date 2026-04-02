import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { QuestionType } from 'src/common/enums'

export class AlternativeDto {
  @ApiProperty({ description: 'Texto da alternativa', example: 'x = 5' })
  @IsString()
  @IsNotEmpty()
  text!: string

  @ApiProperty({ description: 'Se é a alternativa correta', example: true })
  @IsBoolean()
  isCorrect!: boolean
}

export class ConfirmQuestionItemDto {
  @ApiProperty({
    description: 'Enunciado da questão',
    example: 'Qual o valor de x na equação x² - 25 = 0?',
  })
  @IsString()
  @IsNotEmpty()
  statement!: string

  @ApiProperty({
    description: 'Tipo de questão',
    enum: QuestionType,
    example: QuestionType.MULTIPLA_ESCOLHA,
  })
  @IsEnum(QuestionType)
  @IsNotEmpty()
  type!: QuestionType

  @ApiPropertyOptional({
    description: 'Explicação da resposta',
    example: 'Resolvendo: x² = 25, logo x = ±5',
  })
  @IsString()
  @IsOptional()
  explanation?: string

  @ApiPropertyOptional({
    description: 'Resposta correta (para discursiva)',
    example: 'x = 5 ou x = -5',
  })
  @IsString()
  @IsOptional()
  correctAnswer?: string

  @ApiPropertyOptional({
    description: 'Alternativas (para múltipla escolha)',
    type: [AlternativeDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AlternativeDto)
  @IsOptional()
  alternatives?: AlternativeDto[]
}

export class ConfirmQuestionsDto {
  @ApiProperty({
    description: 'Lista de questões revisadas pelo professor',
    type: [ConfirmQuestionItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConfirmQuestionItemDto)
  questions!: ConfirmQuestionItemDto[]
}
