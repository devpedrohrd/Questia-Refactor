import { Inject, Injectable } from '@nestjs/common'
import { Class } from '@repo/api'
import {
  IClassRepository,
  CLASS_REPOSITORY,
  CreateClassInput,
} from '../../domain/repositories/class.repository'
import { ClassCodeAlreadyExistsException } from '../../domain/exceptions/class-code-already-exists.exception'
import { AuthenticatedUser } from 'src/common/interfaces'
import { randomBytes } from 'crypto'

@Injectable()
export class CreateClassUseCase {
  constructor(
    @Inject(CLASS_REPOSITORY)
    private readonly classRepository: IClassRepository,
  ) {}

  async execute(
    data: Omit<CreateClassInput, 'code' | 'teacherId'>,
    user: AuthenticatedUser,
  ): Promise<Class> {
    const code = this.generateClassCode()

    const existingClass = await this.classRepository.findByCode(code)
    if (existingClass) {
      throw new ClassCodeAlreadyExistsException(code)
    }

    return this.classRepository.create({
      ...data,
      code,
      teacherId: user.userId,
    })
  }

  private generateClassCode(): string {
    return randomBytes(4).toString('hex').toUpperCase()
  }
}
