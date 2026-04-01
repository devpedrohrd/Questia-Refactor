import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateClassDto {
  @ApiProperty({ description: 'Nome da turma', example: 'Turma A - 9º Ano' })
  @IsString()
  @IsNotEmpty()
  name!: string

  @ApiProperty({ description: 'Disciplina da turma', example: 'Matemática' })
  @IsString()
  @IsNotEmpty()
  subject!: string

  @ApiPropertyOptional({
    description: 'Descrição da turma',
    example: 'Turma avançada de matemática',
  })
  @IsString()
  @IsOptional()
  description?: string
}
