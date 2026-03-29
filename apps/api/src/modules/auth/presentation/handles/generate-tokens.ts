import { JwtService } from '@nestjs/jwt'
import { JwtPayload as TokenPayload } from 'src/common/interfaces'

export const generateTokens = async (
  jwtService: JwtService,
  payload: TokenPayload,
): Promise<{ accessToken: string; refreshToken: string }> => {
  const accessTokenSecret = String(process.env.JWT_ACCESS_SECRET || '')
  const refreshTokenSecret = String(process.env.JWT_REFRESH_SECRET || '')

  const accessExpiresInSeconds =
    process.env.JWT_ACCESS_EXPIRATION_MINUTES &&
    !isNaN(Number(process.env.JWT_ACCESS_EXPIRATION_MINUTES))
      ? Number(process.env.JWT_ACCESS_EXPIRATION_MINUTES) * 60
      : 15 * 60

  const refreshExpiresInSeconds =
    process.env.JWT_REFRESH_EXPIRATION_DAYS &&
    !isNaN(Number(process.env.JWT_REFRESH_EXPIRATION_DAYS))
      ? Number(process.env.JWT_REFRESH_EXPIRATION_DAYS) * 24 * 60 * 60
      : 7 * 24 * 60 * 60

  const accessToken = jwtService.sign(payload, {
    secret: accessTokenSecret,
    expiresIn: accessExpiresInSeconds,
  })

  const refreshToken = jwtService.sign(payload, {
    secret: refreshTokenSecret,
    expiresIn: refreshExpiresInSeconds,
  })

  return { accessToken, refreshToken }
}
