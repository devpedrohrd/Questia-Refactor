import { Module } from '@nestjs/common'
import { PrismaModule } from './config/prisma/prisma.module'
import { UsersModule } from './modules/users/users.module'
import { AuthModule } from './modules/auth/auth.module'
import { ClassesModule } from './modules/classes/classes.module'
import { EnrollmentsModule } from './modules/enrollments/enrollments.module'

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ClassesModule,
    EnrollmentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
