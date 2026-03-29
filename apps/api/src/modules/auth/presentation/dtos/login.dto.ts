import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class LoginDto {
  @ApiProperty({ description: 'E-mail do usuário' })
  @IsEmail()
  @IsNotEmpty()
  email!: string

  @ApiProperty({ description: 'Senha do usuário' })
  @IsString()
  @IsNotEmpty()
  password!: string
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'Token de refresh' })
  @IsString()
  @IsNotEmpty()
  refreshToken!: string
}
