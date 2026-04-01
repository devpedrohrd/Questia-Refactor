import { Module } from '@nestjs/common'
import { ClassController } from './presentation/controllers/class.controller'
import { CreateClassUseCase } from './application/use-cases/create-class.use-case'
import { FindClassUseCase } from './application/use-cases/find-class.use-case'
import { FindClassesByTeacherUseCase } from './application/use-cases/find-classes-by-teacher.use-case'
import { UpdateClassUseCase } from './application/use-cases/update-class.use-case'
import { DeleteClassUseCase } from './application/use-cases/delete-class.use-case'
import { CLASS_REPOSITORY } from './domain/repositories/class.repository'
import { PrismaClassRepository } from './infrastructure/repositories/prisma-class.repository'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [AuthModule],
  controllers: [ClassController],
  providers: [
    CreateClassUseCase,
    FindClassUseCase,
    FindClassesByTeacherUseCase,
    UpdateClassUseCase,
    DeleteClassUseCase,
    {
      provide: CLASS_REPOSITORY,
      useClass: PrismaClassRepository,
    },
  ],
  exports: [CLASS_REPOSITORY],
})
export class ClassesModule {}
