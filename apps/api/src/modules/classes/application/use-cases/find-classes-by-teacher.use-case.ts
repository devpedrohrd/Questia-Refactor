import { Inject, Injectable } from '@nestjs/common'
import { Class } from '@repo/api'
import {
  IClassRepository,
  CLASS_REPOSITORY,
} from '../../domain/repositories/class.repository'
import { Cacheable } from 'src/common/cache'

@Injectable()
export class FindClassesByTeacherUseCase {
  constructor(
    @Inject(CLASS_REPOSITORY)
    private readonly classRepository: IClassRepository,
  ) {}

  @Cacheable('classes-by-teacher', 180)
  async execute(teacherId: string): Promise<Class[]> {
    return this.classRepository.findByTeacherId(teacherId)
  }
}
