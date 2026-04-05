import { Inject, Injectable } from '@nestjs/common'
import {
  IEnrollmentRepository,
  ENROLLMENT_REPOSITORY,
} from '../../domain/repositories/enrollment.repository'
import { EnrollmentNotFoundException } from '../../domain/exceptions/enrollment-not-found.exception'
import { EnrollmentNotAuthorizedException } from '../../domain/exceptions/enrollment-not-authorized.exception'
import { AuthenticatedUser } from 'src/common/interfaces'
import { Role } from 'src/common/enums'
import { CacheInvalidate } from 'src/common/cache'

@Injectable()
export class UnenrollUseCase {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY)
    private readonly enrollmentRepository: IEnrollmentRepository,
  ) {}

  @CacheInvalidate(
    (id: string) => `cache:enrollment:${id}`,
    'cache:enrollments-by-user:*',
    'cache:enrollments-by-class:*',
  )
  async execute(id: string, user: AuthenticatedUser): Promise<void> {
    const enrollment = await this.enrollmentRepository.findById(id)

    if (!enrollment) {
      throw new EnrollmentNotFoundException(id)
    }

    if (
      enrollment.userId !== user.userId &&
      user.role !== Role.ADMIN &&
      user.role !== Role.PROFESSOR
    ) {
      throw new EnrollmentNotAuthorizedException('ENROLLMENT_NOT_AUTHORIZED')
    }

    await this.enrollmentRepository.delete(id)
  }
}
