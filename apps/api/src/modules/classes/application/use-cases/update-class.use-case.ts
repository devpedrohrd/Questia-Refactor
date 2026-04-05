import { Inject, Injectable } from '@nestjs/common'
import { Class } from '@repo/api'
import {
  IClassRepository,
  CLASS_REPOSITORY,
  UpdateClassInput,
} from '../../domain/repositories/class.repository'
import { ClassNotFoundException } from '../../domain/exceptions/class-not-found.exception'
import { ClassNotAuthorizedException } from '../../domain/exceptions/class-not-authorized.exception'
import { AuthenticatedUser } from 'src/common/interfaces'
import { Role } from 'src/common/enums'
import { CacheInvalidate } from 'src/common/cache'

@Injectable()
export class UpdateClassUseCase {
  constructor(
    @Inject(CLASS_REPOSITORY)
    private readonly classRepository: IClassRepository,
  ) {}

  @CacheInvalidate(
    (id: string) => `cache:class:${id}`,
    'cache:classes-by-teacher:*',
  )
  async execute(
    id: string,
    data: UpdateClassInput,
    user: AuthenticatedUser,
  ): Promise<Class> {
    const existingClass = await this.classRepository.findById(id)

    if (!existingClass) {
      throw new ClassNotFoundException(id)
    }

    if (existingClass.teacherId !== user.userId && user.role !== Role.ADMIN) {
      throw new ClassNotAuthorizedException('CLASS_NOT_AUTHORIZED')
    }

    return this.classRepository.update(id, data)
  }
}
