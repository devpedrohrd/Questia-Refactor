import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  Max,
} from 'class-validator'
import { Difficulty, QuestionType } from 'src/common/enums'

export class CreateQuizDto {
  @ApiProperty({ description: 'Título do quiz', example: 'Quiz de Matemática' })
  @IsString()
  @IsNotEmpty()
  title!: string

  @ApiProperty({
    description: 'Tema do quiz',
    example: 'Equações do 2º Grau',
  })
  @IsString()
  @IsNotEmpty()
  theme!: string

  @ApiProperty({
    description: 'Dificuldade',
    enum: Difficulty,
    example: Difficulty.MEDIO,
  })
  @IsEnum(Difficulty)
  @IsNotEmpty()
  difficulty!: Difficulty

  @ApiProperty({
    description: 'Tipo de questão',
    enum: QuestionType,
    example: QuestionType.MULTIPLA_ESCOLHA,
  })
  @IsEnum(QuestionType)
  @IsNotEmpty()
  questionType!: QuestionType

  @ApiProperty({
    description: 'Quantidade de questões',
    example: 10,
    minimum: 1,
    maximum: 50,
  })
  @IsInt()
  @Min(1)
  @Max(50)
  questionCount!: number

  @ApiProperty({
    description: 'ID da turma vinculada',
    example: 'uuid-da-turma',
  })
  @IsString()
  @IsNotEmpty()
  classId!: string

  @ApiPropertyOptional({
    description: 'ID do contexto de geração (opcional)',
    example: 'uuid-do-contexto',
  })
  @IsString()
  @IsOptional()
  generationContextId?: string
}
