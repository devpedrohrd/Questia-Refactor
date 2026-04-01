import { Inject, Injectable } from '@nestjs/common'
import { Class } from '@repo/api'
import {
  IClassRepository,
  CLASS_REPOSITORY,
} from '../../domain/repositories/class.repository'

@Injectable()
export class FindClassesByTeacherUseCase {
  constructor(
    @Inject(CLASS_REPOSITORY)
    private readonly classRepository: IClassRepository,
  ) {}

  async execute(teacherId: string): Promise<Class[]> {
    return this.classRepository.findByTeacherId(teacherId)
  }
}
