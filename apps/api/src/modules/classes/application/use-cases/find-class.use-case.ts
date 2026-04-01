import { Inject, Injectable } from '@nestjs/common'
import { Class } from '@repo/api'
import {
  IClassRepository,
  CLASS_REPOSITORY,
} from '../../domain/repositories/class.repository'
import { ClassNotFoundException } from '../../domain/exceptions/class-not-found.exception'

@Injectable()
export class FindClassUseCase {
  constructor(
    @Inject(CLASS_REPOSITORY)
    private readonly classRepository: IClassRepository,
  ) {}

  async execute(id: string): Promise<Class> {
    const classEntity = await this.classRepository.findById(id)

    if (!classEntity) {
      throw new ClassNotFoundException(id)
    }

    return classEntity
  }
}
