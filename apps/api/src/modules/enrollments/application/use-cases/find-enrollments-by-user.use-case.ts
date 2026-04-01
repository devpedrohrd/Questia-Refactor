import { Inject, Injectable } from '@nestjs/common'
import { Enrollment } from '@repo/api'
import {
  IEnrollmentRepository,
  ENROLLMENT_REPOSITORY,
} from '../../domain/repositories/enrollment.repository'

@Injectable()
export class FindEnrollmentsByUserUseCase {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY)
    private readonly enrollmentRepository: IEnrollmentRepository,
  ) {}

  async execute(userId: string): Promise<Enrollment[]> {
    return this.enrollmentRepository.findByUserId(userId)
  }
}
