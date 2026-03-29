import { Injectable, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { PrismaService } from 'src/config/prisma/prisma.service'
import { RegisterDto } from '../../presentation/dtos'
import { EmailAlreadyExistsException } from '../../domain/exceptions'
import { JwtPayload } from '../../../../common/interfaces'
import { Role } from 'src/common/enums'
import { generateTokens } from '../../presentation/handles/generate-tokens'

export interface RegisterResult {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
  accessToken: string
  refreshToken: string
}

@Injectable()
export class RegisterUseCase {
  private readonly logger = new Logger(RegisterUseCase.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: RegisterDto): Promise<RegisterResult> {
    const userExists = await this.prisma.user.findFirst({
      where: { email: input.email.toLowerCase() },
    })

    if (userExists) {
      throw new EmailAlreadyExistsException(input.email)
    }

    const hashedPassword = await bcrypt.hash(input.password, 10)

    const user = await this.prisma.user.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase(),
        password: hashedPassword,
        role: Role.ALUNO,
      },
    })

    const payload: JwtPayload = {
      sub: user.id,
      role: user.role,
      email: user.email,
    }

    const { accessToken, refreshToken } = await generateTokens(
      this.jwtService,
      payload,
    )

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    }
  }
}
