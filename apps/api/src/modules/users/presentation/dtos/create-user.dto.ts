import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { Role } from 'src/common/enums'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string

  @IsEmail()
  @IsNotEmpty()
  email!: string

  @IsEnum(Role)
  @IsNotEmpty()
  role!: Role
}
