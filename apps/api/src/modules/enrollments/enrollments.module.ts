import { Module } from '@nestjs/common'
import { EnrollmentController } from './presentation/controllers/enrollment.controller'
import { EnrollUseCase } from './application/use-cases/enroll.use-case'
import { FindEnrollmentUseCase } from './application/use-cases/find-enrollment.use-case'
import { FindEnrollmentsByClassUseCase } from './application/use-cases/find-enrollments-by-class.use-case'
import { FindEnrollmentsByUserUseCase } from './application/use-cases/find-enrollments-by-user.use-case'
import { UnenrollUseCase } from './application/use-cases/unenroll.use-case'
import { ENROLLMENT_REPOSITORY } from './domain/repositories/enrollment.repository'
import { PrismaEnrollmentRepository } from './infrastructure/repositories/prisma-enrollment.repository'
import { AuthModule } from '../auth/auth.module'
import { ClassesModule } from '../classes/classes.module'

@Module({
  imports: [AuthModule, ClassesModule],
  controllers: [EnrollmentController],
  providers: [
    EnrollUseCase,
    FindEnrollmentUseCase,
    FindEnrollmentsByClassUseCase,
    FindEnrollmentsByUserUseCase,
    UnenrollUseCase,
    {
      provide: ENROLLMENT_REPOSITORY,
      useClass: PrismaEnrollmentRepository,
    },
  ],
  exports: [ENROLLMENT_REPOSITORY],
})
export class EnrollmentsModule {}
