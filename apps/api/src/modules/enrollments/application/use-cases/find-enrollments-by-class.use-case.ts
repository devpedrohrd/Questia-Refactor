import { Inject, Injectable } from '@nestjs/common'
import { Enrollment } from '@repo/api'
import {
  IEnrollmentRepository,
  ENROLLMENT_REPOSITORY,
} from '../../domain/repositories/enrollment.repository'

@Injectable()
export class FindEnrollmentsByClassUseCase {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY)
    private readonly enrollmentRepository: IEnrollmentRepository,
  ) {}

  async execute(classId: string): Promise<Enrollment[]> {
    return this.enrollmentRepository.findByClassId(classId)
  }
}
