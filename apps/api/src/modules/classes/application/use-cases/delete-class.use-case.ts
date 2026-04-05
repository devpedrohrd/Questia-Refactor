import { Inject, Injectable } from '@nestjs/common'
import {
  IClassRepository,
  CLASS_REPOSITORY,
} from '../../domain/repositories/class.repository'
import { ClassNotFoundException } from '../../domain/exceptions/class-not-found.exception'
import { ClassNotAuthorizedException } from '../../domain/exceptions/class-not-authorized.exception'
import { AuthenticatedUser } from 'src/common/interfaces'
import { Role } from 'src/common/enums'
import { CacheInvalidate } from 'src/common/cache'

@Injectable()
export class DeleteClassUseCase {
  constructor(
    @Inject(CLASS_REPOSITORY)
    private readonly classRepository: IClassRepository,
  ) {}

  @CacheInvalidate(
    (id: string) => `cache:class:${id}`,
    'cache:classes-by-teacher:*',
    (id: string) => `cache:quizzes-by-class:${id}`,
    (id: string) => `cache:enrollments-by-class:${id}`,
  )
  async execute(id: string, user: AuthenticatedUser): Promise<void> {
    const existingClass = await this.classRepository.findById(id)

    if (!existingClass) {
      throw new ClassNotFoundException(id)
    }

    if (existingClass.teacherId !== user.userId && user.role !== Role.ADMIN) {
      throw new ClassNotAuthorizedException('CLASS_NOT_AUTHORIZED')
    }

    await this.classRepository.delete(id)
  }
}
