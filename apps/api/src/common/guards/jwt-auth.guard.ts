import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { JwtService } from '@nestjs/jwt'
import { Response } from 'express'
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface'
import { JwtPayload } from '../interfaces/jwt-payload.interface'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(@Inject(JwtService) private readonly jwtService: JwtService) {
    super()
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const canActivate = await super.canActivate(context)
      return canActivate as boolean
    } catch (err) {
      return this.handleRefreshToken(context)
    }
  }

  private async handleRefreshToken(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
    const response = context.switchToHttp().getResponse<Response>()

    const refreshToken = request.cookies?.refresh_token
    if (!refreshToken) {
      throw new UnauthorizedException(
        'Sua sessão expirou, faça login novamente.',
      )
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
        },
      )

      const newAccessToken = await this.jwtService.signAsync(
        { sub: payload.sub, role: payload.role, email: payload.email },
        {
          secret: process.env.JWT_ACCESS_SECRET || 'fallback-secret',
          expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as any,
        },
      )

      request.user = {
        userId: payload.sub,
        role: payload.role,
        email: payload.email,
      }

      response.cookie('access_token', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
      })

      return true
    } catch (err) {
      console.error('Refresh Token Error:', err)
      response.clearCookie('access_token')
      response.clearCookie('refresh_token')
      throw new UnauthorizedException('Sessão expirada, faça login novamente.')
    }
  }
}
