import { Module } from '@nestjs/common'
import { UserController } from './presentation/controllers/user.controller'
import { FindUserUseCase } from './application/use-cases/find-user.use-case'
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case'
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case'
import { USER_REPOSITORY } from './domain/repositories/user.repository'
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [
    FindUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}
