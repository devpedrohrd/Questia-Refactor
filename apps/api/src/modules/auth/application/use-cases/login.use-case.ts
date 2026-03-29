import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { PrismaService } from 'src/config/prisma/prisma.service'
import { LoginDto } from '../../presentation/dtos'
import { InvalidCredentialsException } from '../../domain/exceptions'
import { JwtPayload } from 'src/common/interfaces'
import { generateTokens } from '../../presentation/handles/generate-tokens'

export interface LoginResult {
  accessToken: string
  refreshToken: string
}

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: LoginDto): Promise<LoginResult> {
    const user = await this.prisma.user.findFirst({
      where: { email: input.email.toLowerCase() },
    })

    if (!user) {
      throw new InvalidCredentialsException()
    }

    const isPasswordValid = await bcrypt.compare(
      input.password,
      user.password ?? '',
    )

    if (!isPasswordValid) {
      throw new InvalidCredentialsException()
    }

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
      accessToken,
      refreshToken,
    }
  }
}
