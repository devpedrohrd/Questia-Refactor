import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, VerifyCallback } from 'passport-google-oauth20'

export interface GoogleProfile {
  name: string
  email: string
}

interface GoogleProfileRaw {
  name: {
    givenName: string
    familyName: string
  }
  emails: {
    value: string
  }
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      scope: ['email', 'profile'],
    })
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: GoogleProfileRaw,
    done: VerifyCallback,
  ): void {
    const { name, emails } = profile

    const user: GoogleProfile = {
      name: `${name.givenName} ${name.familyName}`.trim(),
      email: emails[0].value as string,
    }

    done(null, user)
  }
}
