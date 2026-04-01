import { Inject, Injectable } from '@nestjs/common'
import { Enrollment } from '@repo/api'
import {
  IEnrollmentRepository,
  ENROLLMENT_REPOSITORY,
} from '../../domain/repositories/enrollment.repository'
import {
  IClassRepository,
  CLASS_REPOSITORY,
} from '../../../classes/domain/repositories/class.repository'
import { AlreadyEnrolledException } from '../../domain/exceptions/already-enrolled.exception'
import { ClassNotFoundException } from '../../../classes/domain/exceptions/class-not-found.exception'
import { AuthenticatedUser } from 'src/common/interfaces'

@Injectable()
export class EnrollUseCase {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY)
    private readonly enrollmentRepository: IEnrollmentRepository,
    @Inject(CLASS_REPOSITORY)
    private readonly classRepository: IClassRepository,
  ) {}

  async execute(
    classCode: string,
    user: AuthenticatedUser,
  ): Promise<Enrollment> {
    const classEntity = await this.classRepository.findByCode(classCode)

    if (!classEntity) {
      throw new ClassNotFoundException(classCode)
    }

    const existingEnrollment =
      await this.enrollmentRepository.findByUserAndClass(
        user.userId,
        classEntity.id,
      )

    if (existingEnrollment) {
      throw new AlreadyEnrolledException(user.userId, classEntity.id)
    }

    return this.enrollmentRepository.create({
      userId: user.userId,
      classId: classEntity.id,
      role: user.role,
    })
  }
}
