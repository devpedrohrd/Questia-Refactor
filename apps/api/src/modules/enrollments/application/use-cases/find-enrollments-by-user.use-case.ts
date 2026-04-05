import { Inject, Injectable } from '@nestjs/common'
import { Enrollment } from '@repo/api'
import {
  IEnrollmentRepository,
  ENROLLMENT_REPOSITORY,
} from '../../domain/repositories/enrollment.repository'
import { Cacheable } from 'src/common/cache'

@Injectable()
export class FindEnrollmentsByUserUseCase {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY)
    private readonly enrollmentRepository: IEnrollmentRepository,
  ) {}

  @Cacheable('enrollments-by-user', 180)
  async execute(userId: string): Promise<Enrollment[]> {
    return this.enrollmentRepository.findByUserId(userId)
  }
}
