import { Response } from 'express'

export async function handleAuthResponse(props: {
  tokens: { access_token: string; refresh_token: string }
  res: Response
  platformHeader: string
  isRefresh: boolean
}) {
  const { tokens, res, platformHeader, isRefresh } = props

  const isMobile = platformHeader === 'mobile'

  if (!isMobile) {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
    }

    const { access_token, refresh_token } = tokens

    res.cookie('access_token', access_token, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    })

    // se for refresh, não cria o refresh token
    if (!isRefresh) {
      res.cookie('refresh_token', refresh_token, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
    }

    return { message: 'Autenticação realizada com sucesso', platform: 'web' }
  }

  return {
    message: 'Autenticação realizada com sucesso',
    platform: 'mobile',
    tokens,
  }
}
