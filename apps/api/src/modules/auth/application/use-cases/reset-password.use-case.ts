import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from 'src/config/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { UserNotFoundException } from 'src/modules/users/domain/exceptions/user-not-found.exception'
import * as bcrypt from 'bcryptjs'

interface ResetTokenPayload {
  sub: string
  email: string
}

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(token: string, newPassword: string): Promise<void> {
    let payload: ResetTokenPayload

    try {
      payload = this.jwtService.verify<ResetTokenPayload>(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      })
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired password reset token')
    }

    const user = await this.prisma.user.findFirst({
      where: {
        id: payload.sub,
        email: payload.email,
      },
    })

    if (!user) {
      throw new UserNotFoundException(payload.email)
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    })
  }
}
