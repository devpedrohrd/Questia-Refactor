import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/config/prisma/prisma.service'
import { JwtPayload } from 'src/common/interfaces'
import { Role } from 'src/common/enums'
import { generateTokens } from '../../presentation/handles/generate-tokens'
import { GoogleProfile } from '../../infrastructure/strategies/google.strategy'

export interface GoogleOAuthResult {
  accessToken: string
  refreshToken: string
}

@Injectable()
export class GoogleOAuthUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(profile: GoogleProfile): Promise<GoogleOAuthResult> {
    let user = await this.prisma.user.findFirst({
      where: { email: profile.email.toLowerCase() },
    })

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          name: profile.name,
          email: profile.email.toLowerCase(),
          role: Role.ALUNO,
        },
      })
    }

    const payload: JwtPayload = {
      sub: user.id,
      role: user.role,
      email: user.email,
    }

    return await generateTokens(this.jwtService, payload)
  }
}
