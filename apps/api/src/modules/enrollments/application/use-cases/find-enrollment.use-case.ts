import { Inject, Injectable } from '@nestjs/common'
import { Enrollment } from '@repo/api'
import {
  IEnrollmentRepository,
  ENROLLMENT_REPOSITORY,
} from '../../domain/repositories/enrollment.repository'
import { EnrollmentNotFoundException } from '../../domain/exceptions/enrollment-not-found.exception'

@Injectable()
export class FindEnrollmentUseCase {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY)
    private readonly enrollmentRepository: IEnrollmentRepository,
  ) {}

  async execute(id: string): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findById(id)

    if (!enrollment) {
      throw new EnrollmentNotFoundException(id)
    }

    return enrollment
  }
}
