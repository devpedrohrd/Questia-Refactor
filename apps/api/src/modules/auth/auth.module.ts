import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { PrismaModule } from 'src/config/prisma/prisma.module'
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy'
import { GoogleStrategy } from './infrastructure/strategies/google.strategy'
import {
  LoginUseCase,
  ForgotPasswordUseCase,
  ResetPasswordUseCase,
  RegisterUseCase,
} from './application/use-cases'
import { MailModule } from '../mail/mail.module'
import { AuthController } from './presentation/controllers'
import { RefreshUseCase } from './application/use-cases/refresh.use-case'
import { GoogleOAuthUseCase } from './application/use-cases/google-oauth.use-case'
import { GoogleAuthGuard } from './infrastructure/guards/google-auth.guard'

@Module({
  imports: [
    PrismaModule,
    MailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || 'fallback-secret',
      signOptions: {
        expiresIn: Number(process.env.JWT_EXPIRES_IN_SECONDS) || 86400,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    GoogleStrategy,
    GoogleAuthGuard,
    LoginUseCase,
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
    RegisterUseCase,
    RefreshUseCase,
    GoogleOAuthUseCase,
  ],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
