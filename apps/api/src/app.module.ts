import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { PrismaModule } from './config/prisma/prisma.module'
import { CacheModule } from './common/cache'
import { UsersModule } from './modules/users/users.module'
import { AuthModule } from './modules/auth/auth.module'
import { ClassesModule } from './modules/classes/classes.module'
import { EnrollmentsModule } from './modules/enrollments/enrollments.module'
import { GenerationContextsModule } from './modules/generation-contexts/generation-contexts.module'
import { QuizzesModule } from './modules/quizzes/quizzes.module'
import { AttemptsModule } from './modules/attempts/attempts.module'

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        url: process.env.REDIS_URL,
      },
      skipVersionCheck: true,
      defaultJobOptions: {
        attempts: 3,
        removeOnFail: true,
      },
    }),
    CacheModule,
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
