import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateEnrollmentDto {
  @ApiProperty({
    description: 'Código da turma para se inscrever',
    example: 'A1B2C3D4',
  })
  @IsString()
  @IsNotEmpty()
  classCode!: string
}
