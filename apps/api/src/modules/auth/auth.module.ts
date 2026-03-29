import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { PrismaModule } from 'src/config/prisma/prisma.module'
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy'
import {
  LoginUseCase,
  ForgotPasswordUseCase,
  ResetPasswordUseCase,
  RegisterUseCase,
} from './application/use-cases'
import { MailModule } from '../mail/mail.module'
import { AuthController } from './presentation/controllers'
import { RefreshUseCase } from './application/use-cases/refresh.use-case'

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
    LoginUseCase,
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
    RegisterUseCase,
    RefreshUseCase,
  ],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
