import { Module } from '@nestjs/common'
import { PrismaModule } from './config/prisma/prisma.module'
import { UsersModule } from './modules/users/users.module'
import { AuthModule } from './modules/auth/auth.module'
import { ClassesModule } from './modules/classes/classes.module'
import { EnrollmentsModule } from './modules/enrollments/enrollments.module'
import { GenerationContextsModule } from './modules/generation-contexts/generation-contexts.module'
import { QuizzesModule } from './modules/quizzes/quizzes.module'
import { AttemptsModule } from './modules/attempts/attempts.module'

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ClassesModule,
    EnrollmentsModule,
    GenerationContextsModule,
    QuizzesModule,
    AttemptsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
