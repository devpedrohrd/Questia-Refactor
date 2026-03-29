import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InvalidTokenException } from '../../domain/exceptions'
import { JwtPayload } from 'src/common/interfaces'
import { RefreshTokenDto } from '../../presentation/dtos/login.dto'
import { generateTokens } from '../../presentation/handles/generate-tokens'

@Injectable()
export class RefreshUseCase {
  constructor(private readonly jwtService: JwtService) {}

  async execute(refreshTokenDto: RefreshTokenDto) {
    try {
      const { refreshToken: token } = refreshTokenDto

      if (!token) {
        throw new InvalidTokenException()
      }

      const userPayload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      })

      const newPayload: JwtPayload = {
        sub: userPayload.sub,
        email: userPayload.email,
        role: userPayload.role,
      }

      const { accessToken, refreshToken } = await generateTokens(
        this.jwtService,
        newPayload,
      )

      return { accessToken, refreshToken }
    } catch (error) {
      console.error('Refresh token verification failed:', error)
      throw new InvalidTokenException()
    }
  }
}
