import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'
import {
  CognitiveLevel,
  LanguageStyle,
  DifficultyStrategy,
} from 'src/common/enums'

export class CreateGenerationContextDto {
  @ApiProperty({
    description: 'Nome do contexto de geração',
    example: 'Contexto Matemática 9º Ano',
  })
  @IsString()
  @IsNotEmpty()
  name!: string

  @ApiProperty({
    description: 'Nível de ensino',
    example: '9º Ano - Ensino Fundamental',
  })
  @IsString()
  @IsNotEmpty()
  gradeLevel!: string

  @ApiProperty({ description: 'Disciplina', example: 'Matemática' })
  @IsString()
  @IsNotEmpty()
  subject!: string

  @ApiProperty({ description: 'Tópico', example: 'Equações do 2º Grau' })
  @IsString()
  @IsNotEmpty()
  topic!: string

  @ApiProperty({
    description: 'Objetivos de aprendizagem',
    example: ['Resolver equações do 2º grau', 'Aplicar a fórmula de Bhaskara'],
  })
  @IsArray()
  @IsString({ each: true })
  learningObjectives!: string[]

  @ApiProperty({
    description: 'Nível cognitivo (Taxonomia de Bloom)',
    enum: CognitiveLevel,
    example: CognitiveLevel.APLICAR,
  })
  @IsEnum(CognitiveLevel)
  @IsNotEmpty()
  cognitiveLevel!: CognitiveLevel

  @ApiProperty({
    description: 'Estilo de linguagem',
    enum: LanguageStyle,
    example: LanguageStyle.FORMAL,
  })
  @IsEnum(LanguageStyle)
  @IsNotEmpty()
  languageStyle!: LanguageStyle

  @ApiProperty({
    description: 'Estratégia de dificuldade',
    enum: DifficultyStrategy,
    example: DifficultyStrategy.PROGRESSIVA,
  })
  @IsEnum(DifficultyStrategy)
  @IsNotEmpty()
  difficultyStrategy!: DifficultyStrategy

  @ApiProperty({
    description: 'Regras adicionais para geração',
    example: ['Não usar termos em inglês', 'Incluir exemplos práticos'],
  })
  @IsArray()
  @IsString({ each: true })
  rules!: string[]

  @ApiPropertyOptional({
    description: 'Material de referência',
    example: 'Livro didático cap. 5',
  })
  @IsString()
  @IsOptional()
  referenceMaterial?: string

  @ApiPropertyOptional({
    description: 'Exemplos de questões (JSON)',
    example: { question: 'Qual o valor de x?', answer: 'x = 5' },
  })
  @IsOptional()
  examples?: Record<string, any>
}
